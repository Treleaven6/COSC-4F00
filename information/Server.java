/*Tina Pazaj - 5550827
COSC 3P91
Assignment 4
 */

package net;

import core.GUI;
import vehicles.Vehicle;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Random;
import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Server extends GUI {

    static ServerGameEngine ge;
    static ServerPlayer serverPlayer;
    /**
     * Entry point
     *
     * @param args road map and port
     * @throws Exception when connection is bad
     */
    public static void main(String[] args) throws Exception {
        //loading all data
        if (args.length != 2) {
            System.out.println("Usage: Java Server roadmap_file port");
            System.exit(0);
        }
        ge = new ServerGameEngine();
        ge.setTrafficNetwork(loadFile(args[0]));
        generateVehicles(ge, 5);
        ge.setTurnCount(6);
        Thread thread = new Thread(ge);
        thread.start();
        //accept Client
        try (ServerSocket listener = new ServerSocket(Integer.parseInt(args[1]))) {
            System.out.println("The  server is waiting for accept...");
            ExecutorService pool = Executors.newFixedThreadPool(20);
            while (true) {
                //executing when connection is accepted
                pool.execute(new Capitalizer(listener.accept()));
            }
        }
    }
    /**
     * Class which represents connection with client
     */
    private static class Capitalizer implements Runnable {
        private Socket socket;

        Capitalizer(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            System.out.println("Connected: " + socket);
            //initializing player
            Random rd = new Random();
            Vehicle forPlayer = ge.getVehicles().remove(rd.nextInt(ge.getVehicles().size()));
            ge.getPlayer().setVehicle(forPlayer);
            serverPlayer = (ServerPlayer) ge.getPlayer();
            try {
                Scanner in = new Scanner(socket.getInputStream());
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                String ans = "";
                //start handshake
                out.println("HELLO");
                ans = in.nextLine();
                if (!ans.toUpperCase().equals("HELLO")) {
                    System.out.println("Wrong handshake");
                } else {
                    out.println("LOAN MONEY");
                    ans = in.nextLine();
                    if (!ans.toUpperCase().equals("GOODBUY")) {
                        System.out.println("Wrong handshake");
                    } else {
                        System.out.println("All is good - client is connected");
                        //end handshake
                        while (ge.isAlive()) {
                            String data = serverPlayer.getMessages();
                            if (data.equals("")) {
                                Thread.sleep(100);
                            } else {
                                //send data to client
                                out.println(data);
                                //and receive it
                                serverPlayer.receive(in.nextLine());
                            }
                        }
                        out.println("Simulation has stopped");
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Error:" + socket);
            } finally {
                try {
                    socket.close();
                } catch (IOException ignored) {
                }
                System.out.println("Closed: " + socket);
            }
        }
    }
}
