/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package listenclient;

import java.io.*;
import java.net.*;
import java.util.*;

/**
 *
 * @author Thinkpad
 */
public class ListenClient {

    public static void main(String[] args) throws Exception {
        String fileName = null;

        try {
            fileName = args[0];
        } catch (Exception e) {
            System.out.println("Enter the name of the file :");
            Scanner scanner = new Scanner(System.in);
            String file_name = scanner.nextLine();

            File file = new File(file_name);
            Socket socket = new Socket("localhost", 1234);
            ObjectInputStream ois = new ObjectInputStream(socket.getInputStream());
            ObjectOutputStream oos = new ObjectOutputStream(socket.getOutputStream());

            oos.writeObject(file.getName());

            FileInputStream fis = new FileInputStream(file);
            byte[] buffer = new byte[ListenServer.BUFFER_SIZE];
            Integer bytesRead = 0;

            while ((bytesRead = fis.read(buffer)) > 0) {
                oos.writeObject(bytesRead);
                oos.writeObject(Arrays.copyOf(buffer, buffer.length));
            }

            oos.close();
            ois.close();
            System.exit(0);
        }
    }
}
