/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package listenserver;

import java.io.*;
import java.net.*;
import java.util.*;

/**
 *
 * @author Ji Wang_Sager
 */
public class ListenServer {

    /**
     * @param args the command line arguments
     */
    private ServerSocket serverSocket;
    private Socket clientSocket;
    private PrintWriter out;
    private BufferedReader in;
    
    public void start(int port) throws IOException {
        serverSocket = new ServerSocket(port);
        clientSocket = serverSocket.accept();
        out = new PrintWriter(clientSocket.getOutputStream(), true);
        in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
        //this part is the actual interaction
        /*while(true){
            
        }*/
    }

    public void stop() throws IOException {
        in.close();
        out.close();
        clientSocket.close();
        serverSocket.close();
    }

    public static void main(String[] args) throws IOException {
        ListenServer server = new ListenServer();
        server.start(1234);
    }
    
}
