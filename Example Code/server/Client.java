package ca.brocku.cosc3p97.server;

import ca.brocku.cosc3p97.database.Conversation;
import ca.brocku.cosc3p97.database.Language;
import ca.brocku.cosc3p97.database.Message;
import ca.brocku.cosc3p97.database.User;
import ca.brocku.cosc3p97.shared.NetworkPort;
import ca.brocku.cosc3p97.shared.Pair;
import ca.brocku.cosc3p97.shared.transmission.*;

import java.io.UnsupportedEncodingException;
import java.net.Socket;
import java.util.*;

import static ca.brocku.cosc3p97.shared.transmission.Transmission.Status.ACCEPTED;
import static ca.brocku.cosc3p97.shared.transmission.Transmission.Status.DECLINED;
import static ca.brocku.cosc3p97.shared.transmission.Transmission.Type.*;
import static ca.brocku.cosc3p97.shared.transmission.Update.Action.ADD;
import static ca.brocku.cosc3p97.shared.transmission.Update.Action.REMOVE;

/**
 * Server
 * ca.brocku.cosc3p97.server.Client
 *
 * @author Jesse Treleaven (5903851)
 * @author Trevor Vanderee (5877022)
 */

public class Client implements Runnable {

    private final Integer connectionId;
    private boolean isRunning;

    private NetworkPort networkPort;
    private ClientListener clientListener;
    private User user;


    public Client(Integer connectionId, Socket socket) {
        this.connectionId = connectionId;
        this.networkPort = new NetworkPort(socket);
        this.clientListener = new ClientListener(this, networkPort);
        this.isRunning = true;
        this.user = null;
    }

    @Override
    public void run() {
        clientListener.start();
        requestAuthentication();

        while (clientListener.isRunning()) {
            synchronized (this) {
                try {
                    this.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }

        isRunning = false;
    }

    void requestAuthentication() {
        System.out.printf("%n%d: Requesting Authentication...%n", connectionId);
        Request.Authentication request = new Request.Authentication();
        networkPort.send(request);
    }

    void authenticate(Credential.SignIn data) {
        User tempUser = User.login(data);

        if (tempUser != null) {
            System.out.println("\t-> " + data.getUsername() + " was authenticated");
            user = tempUser;
            data.setUserId(user.getUserID());
            data.setStatus(ACCEPTED);
        } else {
            System.out.println("\t-> " + data.getUsername() + " was rejected");
            data.setStatus(DECLINED);
        }

        networkPort.send(data);
    }

    void authenticate(Credential.SignUp data) {
        User tempUser = new User(data);

        if (tempUser.register()) {
            System.out.println("\t-> " + tempUser.getDisplayName() + " was authenticated");
            user = tempUser;
            data.setUserId(user.getUserID());
            data.setStatus(ACCEPTED);
        } else {
            System.out.println("\t-> " + tempUser.getDisplayName() + " was rejected");
            data.setStatus(DECLINED);
        }

        networkPort.send(data);
    }

    void update(Request.Language data) {
        List<String> supportedLanguageCodes = Language.getLanguageCodeList();
        List<String> clientLanguageCodes = data.getLanguageCodeList();

        List<String> removeList = new LinkedList<>();
        client:
        for (String clientLang : clientLanguageCodes) {
            for (String supportedLang : supportedLanguageCodes) {
                if (clientLang.equals(supportedLang)) {
                    supportedLanguageCodes.remove(supportedLang);
                    continue client;
                }
            }
            removeList.add(clientLang); // Server List doesn't contain this language
        }

        System.out.println("\t-> Client has " + clientLanguageCodes);
        System.out.println("\t-> Updating " + supportedLanguageCodes);

        List<Update> updateList = (!supportedLanguageCodes.isEmpty()) ? Language.getUpdateList(supportedLanguageCodes) : new LinkedList<>();
        for (String language : removeList) {
            updateList.add(new Update.Language(Update.Action.REMOVE, language, null));
        }


        networkPort.send(new UpdateList(user.getUserID(), Transmission.Type.LANGUAGE, updateList));
    }

    void update(Request.Conversation data) {
        List<Integer> conversationIdList = Conversation.getConversationByUserId(user.getUserID());
        List<Integer> clientIdList = data.getConversationIdList();

        List<Integer> removeList = new LinkedList<>();
        client:
        for (Integer clientId : clientIdList) {
            for (Integer conversationId : conversationIdList) {
                if (clientId.equals(conversationId)) {
                    conversationIdList.remove(conversationId);
                    continue client;
                }
            }
            removeList.add(clientId);
        }


        System.out.println("\t-> Client has " + clientIdList);
        System.out.println("\t-> Adding " + conversationIdList + "\tRemoving " + removeList);

        List<Update.Conversation> updateList = (!conversationIdList.isEmpty()) ? Conversation.getUpdateList(user.getUserID(), conversationIdList) : new LinkedList<>();
        List<Update.PalName> palNameList = (!conversationIdList.isEmpty()) ? Conversation.getPalNames(user.getUserID(), updateList) : new LinkedList<>();
        for (Integer conversationId : removeList) {
            updateList.add(new Update.Conversation(Update.Action.REMOVE, conversationId, user.getUserID(), null, null, null));
        }

        networkPort.send(new UpdateList(user.getUserID(), CONVERSATION, updateList));
        networkPort.send(new UpdateList(user.getUserID(), PAL, palNameList));
    }

    void update(Request.Message data) {
        List<Pair<Integer, Integer>> keyList = new LinkedList<>();
        keyList.addAll(data.getMessageList());
        HashMap<Integer, List<Integer>> clientConversations = new HashMap<>();
        for (Pair<Integer, Integer> key : keyList) {
            if (!clientConversations.containsKey(key.getLeft())) {
                clientConversations.put(key.getLeft(), new LinkedList<>());
            }
            clientConversations.get(key.getLeft()).add(key.getRight());

        }

        for (Integer conversationId : clientConversations.keySet()) {
            Conversation conversation = Conversation.getConversationById(conversationId);
            List<Integer> messageIdList = clientConversations.get(conversationId);
            List<Integer> fullMessageIdList = Message.getMessagesIdFromConversation(conversationId);

            List<Integer> removeList = new LinkedList<>();
            client:
            for (Integer clientMsgId : messageIdList) {
                for (Integer msgId : fullMessageIdList) {
                    if (clientMsgId == null) {
                        continue client;
                    } else if (clientMsgId.equals(msgId)) {
                        fullMessageIdList.remove(msgId);
                        continue client;
                    }
                }
                removeList.add(clientMsgId);
            }

            System.out.println("\t-> (" + conversationId + ") Client has " + clientConversations.get(conversationId));
            System.out.println("\t-> (" + conversationId + ") Updating " + fullMessageIdList);


            List<Update> updateList = !fullMessageIdList.isEmpty() ? Message.getUpdateList(conversationId, fullMessageIdList) : new LinkedList<>();
            for (Integer messageId : removeList) {
                updateList.add(new Update.Message(Update.Action.REMOVE, conversationId, messageId, null, null, null, null));
            }

            networkPort.send(new UpdateList(user.getUserID(), Transmission.Type.MESSAGE, updateList));
        }
    }

    void requestPal(Request.Pal palRequest) {
        System.out.println("\t-> (" + user.getUserID() + ") " + user.getDisplayName() + " [" + palRequest.getMyLang() + "] requested a pal speaking [" + palRequest.getPalLang() + "]");
        ca.brocku.cosc3p97.database.Request request = new ca.brocku.cosc3p97.database.Request(palRequest);

        if (request.register()) {
            Conversation conversation = request.getConversation();
            if (conversation != null) {
                System.out.println("\t-> Match Found! Sending conversation...");
                List<Update.Conversation> conversationList = Collections.singletonList(conversation.getUpdateConversation(ADD));
                UpdateList updateList = new UpdateList(user.getUserID(), CONVERSATION, conversationList);
                List<Update.PalName> palNameList = Conversation.getPalNames(user.getUserID(), conversationList);
                UpdateList transmission = new UpdateList(user.getUserID(), PAL, palNameList);

                networkPort.send(updateList);
                networkPort.send(transmission);

                NetworkPort palPort = Server.getConnectedPal(conversation.getPartner(user.getUserID()));
                if (palPort != null) {
                    palPort.send(updateList);
                    transmission = new UpdateList(user.getUserID(), PAL, Conversation.getPalNames(conversation.getPartner(user.getUserID()), conversationList));
                    palPort.send(transmission);
                }
            }
        }
    }

    void removeConversation(Request.RemovePal transmission) {

        Conversation conversation = Conversation.getConversationById(transmission.getConversationId());

        if (conversation.close()) {
            Update.Conversation update = conversation.getUpdateConversation(REMOVE);
            UpdateList updateList = new UpdateList(user.getUserID(), REMOVE_PAL, Arrays.asList(update));

            networkPort.send(updateList);

            NetworkPort palPort = Server.getConnectedPal(conversation.getPartner(user.getUserID()));
            if (palPort != null) palPort.send(updateList);
        }
    }

    void changeName(UpdateList transmission) {
        List<Update.PalName> list = (List<Update.PalName>) transmission.getUpdateList();

        if (list.size() <= 0) return;
        String name = list.get(0).getPalName();
        user.updateDisplayName(name);

        System.out.println("\t-> ("+user.getUserID()+") Updated name to "+name);
    }

    void receiveMessage(UpdateList updateList) {
        // Sort messages by conversation (in case many are received at once)
        List<Update.Message> messageList = (List<Update.Message>) updateList.getUpdateList();
        HashMap<Integer, List<Update.Message>> messageMap = new HashMap<>();
        for (Update.Message message : messageList) {
            if (!messageMap.containsKey(message.getConversationId())) {
                messageMap.put(message.getConversationId(), new LinkedList<>());
            }

            messageMap.get(message.getConversationId()).add(message);
        }

        Conversation conversation;
        String originalText;
        String translatedText;
        Translator translator = Translator.getInstance();
        // For each conversation grouping
        for (Integer conversationId : messageMap.keySet()) {
            // Sort into chronological order
            List<Update.Message> messages = messageMap.get(conversationId);
            Collections.sort(messages, Update.Message.getComparator());

            // For each message
            for (Update.Message message : messages) {
                conversation = Conversation.getConversationById(conversationId);

                try {

                    originalText = message.getmessage1();

                    if (conversation.getLanguageCode1().equalsIgnoreCase(conversation.getLanguageCode2())) {
                        translatedText = originalText;
                    } else {
                        translatedText = new String(translator.translate(originalText, conversation.getLanguage(user.getUserID()), conversation.getLanguage(conversation.getPartner(user.getUserID()))).getBytes("UTF-8"));
                    }
                    System.out.println("\t-> Received [" + conversation.getLanguage(user.getUserID()) + "]:\t" + originalText);
                    System.out.println("\t-> Translated [" + conversation.getLanguage(conversation.getPartner(user.getUserID())) + "]:\t" + translatedText);

                    Message fullMessage;
                    if (conversation.isUser1(user.getUserID())) {
                        fullMessage = new Message(conversationId, user.getUserID(), originalText, translatedText, message.getTimestamp());
                    } else {
                        fullMessage = new Message(conversationId, user.getUserID(), translatedText, originalText, message.getTimestamp());
                    }

                    if (fullMessage.register()) {
                        Update.Message updateMessage = new Update.Message(ADD, fullMessage.getConversationId(), fullMessage.getMessageId(), fullMessage.getSenderId(), fullMessage.getMessage1(), fullMessage.getMessage2(), fullMessage.getTimestamp());
                        UpdateList transmission = new UpdateList(user.getUserID(), MESSAGE, Collections.singletonList(updateMessage));
                        networkPort.send(transmission);

                        NetworkPort palPort = Server.getConnectedPal(conversation.getPartner(user.getUserID()));
                        if (palPort != null) {
                            palPort.send(transmission);
                        }
                    }

                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }

            }
        }

    }

    /*
        Getter
     */
    Integer getConnectionId() {
        return connectionId;
    }

    Integer getUserId() {
        if (user != null) {
            return user.getUserID();
        } else {
            return null;
        }
    }

    NetworkPort getNetworkPort() {
        return networkPort;
    }

    boolean isRunning() {
        return isRunning;
    }

    boolean isAuthenticated(Integer userId) {
        return user != null && user.getUserID() != null && user.getUserID().equals(userId);
    }



}
