package ca.brocku.cosc3p97.server;

import ca.brocku.cosc3p97.database.Database;
import ca.brocku.cosc3p97.shared.NetworkPort;

import javax.net.ServerSocketFactory;
import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Server
 * ca.brocku.cosc3p97.server.Server
 *
 * @author Jesse Treleaven (5903851)
 * @author Trevor Vanderee (5877022)
 */

public class Server implements Runnable {

    // Main Method
    public static void main(String... args) {
        new Thread(new Server()).start();
    }

    // Server Static Variables
    public static final Integer CAPACITY = 20;
    public static final Integer PORT = 3030;
    public static Server instance = null;

    public static NetworkPort getConnectedPal(int userId) {
        ConcurrentHashMap<Integer, Client> clientMap = Server.instance.clientMap;
        for (Integer connectionId : clientMap.keySet()) {
            Client client = clientMap.get(connectionId);
            Integer clientUserId = client.getUserId();
            if (clientUserId == null || !clientUserId.equals(userId)) continue;
            return client.getNetworkPort();
        }

        return null;
    };

    /*
        Server
     */

    private ServerSocket serverSocket;
    private boolean isRunning;

    private final ConcurrentHashMap<Integer, Client> clientMap;
    private Integer index;

    private Server() {
        this.serverSocket = null;
        this.isRunning = false;
        this.clientMap = new ConcurrentHashMap<>();
        this.index = 1;
        Server.instance = this;
    }

    @Override
    public void run() {
        try {   // Attempt to Launch Server
            Database.getInstance();
            serverSocket = ServerSocketFactory.getDefault().createServerSocket(PORT, CAPACITY, InetAddress.getLocalHost());
            isRunning = true;
            System.out.printf("Listening on %s:%s%n", String.valueOf(serverSocket.getInetAddress()), String.valueOf(serverSocket.getLocalPort()));
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Server could not be started\nClosing...");
            System.exit(1);
        }

        ConnectionCloser connectionCloser = new ConnectionCloser();
        connectionCloser.start();

        Socket socket;
        while(isRunning) {
            try {
                if (Server.CAPACITY <= clientMap.size()+1) {
                    synchronized (this) { wait(5000); }
                } else {
                    socket = serverSocket.accept();
                    new Thread(new ConnectionHandler(index++, socket)).start();
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void printStatus() {
        System.out.printf("%nServer Capacity:\t%d / %d%n", clientMap.size(), Server.CAPACITY);
    }

    /*
        Connection Handler
        - called when a socket is received, handles the creation of a connection
     */
    private class ConnectionHandler extends Thread {

        private Integer connectionId;
        private Socket socket;

        public ConnectionHandler(Integer connectionId, Socket socket) {
            this.connectionId = connectionId;
            this.socket = socket;
        }

        @Override
        public void run() {
            Client client = new Client(connectionId, socket);
            clientMap.put(connectionId, client);
            new Thread(client).start();
            printStatus();
            System.out.printf("\t-> (%d) Connection accepted%n", connectionId);
        }
    }

    /*
        ConnectionCloser
        - Handles dead connections
     */
    private class ConnectionCloser extends Thread {
        @Override
        public void run() {
            while(Server.this.isRunning) {
                try {
                    sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                boolean hasClosedConnection = false;
                for (Client client : clientMap.values()) {
                    if (!client.isRunning()) {
                        clientMap.remove(client.getConnectionId());
                        hasClosedConnection = true;
                        printStatus();
                        System.out.printf("\t-> (%d) Connection dropped%n", client.getConnectionId());
                    }
                }

                if(hasClosedConnection) synchronized (Server.this) { Server.this.notify(); }
            }
        }
    }


}
