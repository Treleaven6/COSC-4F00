/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//package listenclient;

import java.io.*;
import java.net.*;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;

/**
 *
 * @author Ji Wang_Sager
 */
public class ListenServer extends Thread {

    public static final int PORT = 1234;
    public static final int BUFFER_SIZE = 100;

    @Override
    public void run() {
        try {
            ServerSocket serverSocket = new ServerSocket(PORT);

            while (true) {
                Socket s = serverSocket.accept();
                saveFile(s);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void saveFile(Socket socket) throws Exception {
        BufferedInputStream bis = new BufferedInputStream(socket.getInputStream());

        // adapted from
        // https://stackoverflow.com/questions/5713857/bufferedinputstream-to-string-conversion

        String size = "";
        byte[] prefix = new byte[4];
        int totalBytesRead = 0;
        int bytesRead = 0;

        while (true) {
            bytesRead = bis.read(prefix);
            if (bytesRead < 0) break;
            size += new String(prefix, 0, bytesRead); 
            totalBytesRead += bytesRead;
            if (totalBytesRead >= 4) break;
        }
        
        String strFilePath = "";
        byte[] contents = new byte[Integer.parseInt(size)];
        totalBytesRead = 0;
        bytesRead = 0;

        while (true) {
            bytesRead = bis.read(contents);
            if (bytesRead < 0) break;
            strFilePath += new String(contents, 0, bytesRead); 
            totalBytesRead += bytesRead;
            if (totalBytesRead >= 4) break;
        }

        //System.out.println(strFilePath);
        try {
            extractFolder(strFilePath);
        } catch (java.io.FileNotFoundException fnfe) {
            System.out.println(fnfe);
        }
        
        //DataOutputStream bos = new DataOutputStream(socket.getOutputStream());
        //bos.writeBytes("Got it");
        //bos.close();
        bis.close();

        /*
        ObjectOutputStream oos = new ObjectOutputStream(socket.getOutputStream());
        ObjectInputStream ois = new ObjectInputStream(socket.getInputStream());
        BufferedInputStream bis = new BufferedInputStream(socket.getInputStream());
        byte[] buffer = new byte[BUFFER_SIZE];

        // 1. Read file name.
        Object o = ois.readObject();;
        //extractFolder(o.toString());
        if (o instanceof String) {
            fos = new FileOutputStream(o.toString());
        } else {
            throwException("Something is wrong");
        }
        
        // 2. Read file to the end.
        Integer bytesRead = 0;

        do {
            o = ois.readObject();

            if (!(o instanceof Integer)) {
                throwException("Something is wrong");
            }

            bytesRead = (Integer) o;

            o = ois.readObject();

            if (!(o instanceof byte[])) {
                throwException("Something is wrong");
            }

            buffer = (byte[]) o;

            // 3. Write data to output file.
            fos.write(buffer, 0, bytesRead);
            extractFolder(o.toString());
        } while (bytesRead == BUFFER_SIZE);

        System.out.println("File transfer success");

        fos.close();

        ois.close();
        oos.close();
        */
    }
    static public void extractFolder(String zipFile) throws ZipException, IOException {
        System.out.println(zipFile);
        int BUFFER = 2048;
        File file = new File(zipFile);

        ZipFile zip = new ZipFile(file);
        String newPath = zipFile.substring(0, zipFile.length() - 4);

        new File(newPath).mkdir();
        Enumeration zipFileEntries = zip.entries();

        while (zipFileEntries.hasMoreElements()) {
            ZipEntry entry = (ZipEntry) zipFileEntries.nextElement();
            String currentEntry = entry.getName();
            File destFile = new File(newPath, currentEntry);
            File destinationParent = destFile.getParentFile();
            destinationParent.mkdirs();

            if (!entry.isDirectory()) {
                BufferedInputStream is = new BufferedInputStream(zip.getInputStream(entry));
                int currentByte;
                byte data[] = new byte[BUFFER];
                FileOutputStream fos = new FileOutputStream(destFile);
                BufferedOutputStream dest = new BufferedOutputStream(fos, BUFFER);
                while ((currentByte = is.read(data, 0, BUFFER)) != -1) {
                    dest.write(data, 0, currentByte);
                }
                dest.flush();
                dest.close();
                is.close();
            }

            if (currentEntry.endsWith(".zip")) {
                extractFolder(destFile.getAbsolutePath());
            }
        }
    }
    public static void throwException(String message) throws Exception {
        throw new Exception(message);
    }

    public static void main(String[] args) throws IOException {
        new ListenServer().start();

    }
}
