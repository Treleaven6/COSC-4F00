package ca.brocku.cosc3p97.server;

import ca.brocku.cosc3p97.shared.NetworkPort;
import ca.brocku.cosc3p97.shared.transmission.Credential;
import ca.brocku.cosc3p97.shared.transmission.Request;
import ca.brocku.cosc3p97.shared.transmission.Transmission;
import ca.brocku.cosc3p97.shared.transmission.UpdateList;

import static ca.brocku.cosc3p97.shared.transmission.Transmission.Type.CREDENTIAL;

/**
 * Server
 * ca.brocku.cosc3p97.server.ClientListener
 *
 * @author Jesse Treleaven (5903851)
 * @author Trevor Vanderee (5877022)
 */

class ClientListener extends Thread {

    private final Client client;
    private final NetworkPort networkPort;

    private boolean isRunning;

    ClientListener(Client client, NetworkPort networkPort) {
        this.client = client;
        this.networkPort = networkPort;
        this.isRunning = false;
    }

    @Override
    public void run() {
        isRunning = true;

        while (isRunning) {

            Transmission transmission = networkPort.receive();
            if(transmission == null) {
                networkPort.close();
                break;
            }
            handleTransmission(transmission);
        }
        isRunning = false;
        synchronized (client) {
            client.notify();
        }
    }

    public void handleTransmission(Transmission transmission) {

        System.out.printf("%n%d: Transmission received (%s, %s)%n", client.getConnectionId(), transmission.getType().toString(), transmission.getStatus().toString());

        // Client Authentication
        if(transmission.getType().equals(CREDENTIAL)) {
            if(transmission instanceof Credential.SignIn) {
                System.out.println("\t-> Attempting Sign In");
                client.authenticate(((Credential.SignIn) transmission));
            } else if(transmission instanceof Credential.SignUp) {
                System.out.println("\t-> Attempting Sign Up");
                client.authenticate(((Credential.SignUp) transmission));
            } else {
                System.out.println("\t-> Invalid Credential Type");
            }


        } else if (client.isAuthenticated(transmission.getUserId())) {

            // Client request for data
            if (transmission instanceof Request) {
                if (transmission instanceof Request.Language) {
                    System.out.println("\t-> Updating Languages...");
                    client.update(((Request.Language) transmission));
                } else if (transmission instanceof  Request.Pal) {
                    System.out.println("\t-> Requesting Pal...");
                    client.requestPal((Request.Pal) transmission);
                } else if (transmission instanceof Request.RemovePal) {
                    System.out.println("\t-> Closing conversation...");
                    client.removeConversation(((Request.RemovePal) transmission));
                } else if (transmission instanceof Request.Conversation) {
                    System.out.println("\t-> Updating Conversations...");
                    client.update(((Request.Conversation) transmission));
                } else if (transmission instanceof Request.Message) {
                    System.out.println("\t-> Updating Messages...");
                    client.update(((Request.Message) transmission));
                } else {
                    System.out.println("\t-> Invalid Update Request Type");
                }
            } else if (transmission instanceof UpdateList) {
                switch (transmission.getType()) {
                    case MESSAGE:
                        client.receiveMessage((UpdateList) transmission);
                        break;

                    case PAL:   // Update my name
                        System.out.println("\t-> Changing name...");
                        client.changeName(((UpdateList) transmission));
                        break;
                }
            }

        }
    }

    /*
        Getter
     */
    public boolean isRunning() {
        return isRunning;
    }
}
