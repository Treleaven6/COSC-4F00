package mocd;

import mocd.algorithm.PackageProcessor;

import javax.net.ServerSocketFactory;
import java.io.*;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;

public class Server implements Runnable {

    public static final int PORT = 1234;
    public static final int MAX_CONNECTIONS = 10;

    private Thread thread;
    private boolean isRunning = false;

    public void start() {
        isRunning = true;
        thread = new Thread(this);
        thread.start();
    }

    public void stop() {
        isRunning = false;
    }

    @Override
    public void run() {
        try {
            ServerSocket serverSocket = ServerSocketFactory.getDefault().createServerSocket(PORT, MAX_CONNECTIONS, InetAddress.getLocalHost());
            System.out.printf("Listening on %s:%s%n", String.valueOf(serverSocket.getInetAddress()), String.valueOf(serverSocket.getLocalPort()));

            while (isRunning) {
                Socket s = serverSocket.accept();

                System.out.println("Connection Created");
                saveFile(s);    // TODO - handle on separate thread
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void saveFile(Socket socket) throws Exception {

        BufferedInputStream bis = new BufferedInputStream(socket.getInputStream());

        // adapted from
        // https://stackoverflow.com/questions/5713857/bufferedinputstream-to-string-conversion

        // get path length
        byte[] path_length_bytes = new byte[4];
        readBytesFromBuffer(bis, path_length_bytes);
        String path_length = new String(path_length_bytes, 0, path_length_bytes.length);

        // get original path (can get name from this, which the frontend will need on the way back)
        byte[] zip_path_bytes = new byte[Integer.parseInt(path_length)];
        readBytesFromBuffer(bis, zip_path_bytes);
        String zip_path = new String(zip_path_bytes, 0, zip_path_bytes.length);

        /**/
        // get length of the rest of the message
        byte[] file_length_bytes = new byte[12];
        readBytesFromBuffer(bis, file_length_bytes);
        String file_length = new String(file_length_bytes, 0, file_length_bytes.length);

        // get file contents, which have first been base64 encoded and then URL encoded
        byte[] file_bytes = new byte[Integer.parseInt(file_length)];
        readBytesFromBuffer(bis, file_bytes);
        String file = new String(file_bytes, 0, file_bytes.length);
        String outputPath = "./" + zip_path.substring(zip_path.lastIndexOf('/'));


        // TODO - extract to a unique path within Z:/MOCD
        try {
            String result = java.net.URLDecoder.decode(file, java.nio.charset.StandardCharsets.UTF_8.name());
            try (FileOutputStream fos = new FileOutputStream(outputPath)) {

                fos.write(java.util.Base64.getDecoder().decode(result));
                File dir = extractFolder(outputPath);

                PackageProcessor packageProcessor = new PackageProcessor(dir);
                packageProcessor.run();

                File results = packageProcessor.getResults();
                sendFile(socket, results);

            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        /**/
        bis.close();

    }

    public void sendFile(Socket socket, File file) throws IOException {

        int count;
        byte[] buffer = new byte[1024];

        OutputStream out = socket.getOutputStream();
        BufferedInputStream in = new BufferedInputStream(new FileInputStream(file));

        byte[] bytes = ByteBuffer.allocate(8).putLong(file.length()).array();
        out.write(bytes);
        out.flush();

        while ((count = in.read(buffer)) > 0) {
            out.write(buffer, 0, count);
            out.flush();
        }

        in.close();

    }

    private void readBytesFromBuffer(BufferedInputStream bis, byte[] out) {
        int totalBytesRead = 0;
        int bytesRead = 0;
        while (true) {
            try {
                bytesRead = bis.read(out, totalBytesRead, out.length);
            } catch (java.io.IOException ioe) {
                System.out.println(ioe);
                break;
            }
            if (bytesRead < 0) break;
            totalBytesRead += bytesRead;
            if (totalBytesRead >= out.length) break;
        }
    }

    public static File extractFolder(String filePath) throws ZipException, IOException {

        final int bufferSize = 2048;

        String outputPath = filePath.substring(0, filePath.lastIndexOf('.'));
        File outputDir = new File(outputPath);

        if (!outputDir.exists() && !outputDir.mkdirs()) {
            throw new IOException("File path could not be created: " + outputPath);
        }

        ZipFile zip = new ZipFile(filePath);
        Enumeration zipEntries = zip.entries();

        ZipEntry entry;
        String entryPath;
        File entryFile;
        while (zipEntries.hasMoreElements()) {
            entry = (ZipEntry) zipEntries.nextElement();
            entryPath = entry.getName();
            entryFile = new File(outputDir, entryPath);

            if (!entry.isDirectory()) {
                BufferedInputStream is = new BufferedInputStream(zip.getInputStream(entry));
                int currentByte;
                byte data[] = new byte[bufferSize];
                if (!entryFile.exists()) entryFile.getParentFile().mkdirs();
                FileOutputStream fos = new FileOutputStream(entryFile);
                BufferedOutputStream dest = new BufferedOutputStream(fos, bufferSize);
                while ((currentByte = is.read(data, 0, bufferSize)) != -1) {
                    dest.write(data, 0, currentByte);
                }
                dest.flush();
                dest.close();
                is.close();
            }

            if (entryPath.endsWith(".zip")) {
                extractFolder(entryFile.getAbsolutePath());
            }


        }

        zip.close();
        return outputDir;
    }

    public static void main(String[] args) throws IOException {
        Server server = new Server();
        server.start();
    }

}
