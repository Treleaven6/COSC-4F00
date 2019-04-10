/*Tina Pazaj - 5550827
COSC 3P91
Assignment 4
 */

package net;

import core.GameEngine;
import core.Player;
import roads.Intersection;
import roads.Lane;
import roads.RoadSegment;
import roads.TrafficElement;

/**
 * Add-on to vehicle class, which is controlled by player
 */
public class ServerPlayer extends Player {

    private String buffer;
    private String answer;
    private boolean questionIsHere;
    public ServerPlayer(GameEngine ge) {
        super(ge);
        gameEngine = ge;
        buffer = "";
        answer = "";
        questionIsHere = false;
    }

    /**
     * get player decision from console
     */
    @Override
    public void makeMovementDecision() {
        TrafficElement currElem = vehicle.getMovementStatus().getPosition().getTrafficElement();
        buffer = buffer + "You are on " + currElem.getClass().getSimpleName() + "DELIMITER";
        switch (currElem.getClass().getSimpleName()) {
            case "Lane":
                Lane currLane = (Lane) currElem;
                buffer = buffer + ("On this lane there is " + gameEngine.getTrafficNetwork().checkNumberVehicleslnLane(currLane)
                        + " another vehiclesDELIMITERSelect choice:DELIMITER1 - more speedDELIMITER2 - less speedDELIMITER3 or another - no change") + "DELIMITER";
                switch (getData()) {
                    case "1":
                        vehicle.getMovementStatus().setSpeed(vehicle.getMovementStatus().getSpeed() + 0.001);
                        if (vehicle.getMovementStatus().getSpeed() > vehicle.getMaxSpeed()) {
                            vehicle.getMovementStatus().setSpeed(vehicle.getMaxSpeed());
                        }
                        break;
                    case "2":
                        vehicle.getMovementStatus().setSpeed(vehicle.getMovementStatus().getSpeed() - 0.001);
                        if (vehicle.getMovementStatus().getSpeed() < 0) {
                            vehicle.getMovementStatus().setSpeed(0.0);
                        }
                        break;
                }
                vehicle.move();
                break;
            case "Intersection":
                Intersection currInter = (Intersection) currElem;
                buffer = buffer + ("You see:") + "DELIMITER";
                int rsI = 1;
                for (RoadSegment rs : currInter.getRoads()) {
                    buffer = buffer + ("\tRoad segment " + rsI + " with:") + "DELIMITER";
                    int lI = 1;
                    for (Lane lane : rs.getLanes()) {
                        buffer = buffer + ("\t\tLane " + lI + " with " +
                                gameEngine.getTrafficNetwork().checkNumberVehicleslnLane(lane) + " on " + lane.getDirection()) + "DELIMITER";
                        lI++;
                    }
                    rsI++;
                }
                boolean run = true;
                while (run) {
                    buffer = buffer + ("Enter number of road segments and its lane separated by a space") + "DELIMITER";
                    String[] kj = getData().split(" ");
                    try {
                        Lane lane = currInter.getRoads().get(Integer.parseInt(kj[0]) - 1).getLanes().get(Integer.parseInt(kj[01]) - 1);
                        if (!lane.getDirection().isOpposite(vehicle.getMovementStatus().getDirection())) {
                            vehicle.getMovementStatus().getPosition().setTrafficElement(lane);
                            vehicle.getMovementStatus().setDirection(lane.getDirection());
                            run = false;
                        } else {
                            buffer = buffer + ("You cannot go the opposite direction") + "DELIMITER";
                        }
                    } catch (NumberFormatException e) {
                        buffer = buffer + ("This road is absent. Select another") + "DELIMITER";
                    }
                }
                break;
        }
    }
    /**
     * Waiter of message from client
     * @return
     */
    private String getData() {
        questionIsHere = true;
        while (answer.equals("")) {
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        questionIsHere = false;
        String res = answer;
        answer = "";
        return res;
    }
    /**
     * Add message to total
     * @param message string
     */
    public void addMessage(String message) {
        buffer = buffer + message + "DELIMITER";
    }
    /**
     * Getter of message
     * @return message if exist
     */
    public String getMessages() {
        if (questionIsHere) {
            String res = buffer;
            buffer = "";
            return res;
        } else {
            return "";
        }
    }

    /**
     * public setter
     * @param s
     */
    public void receive(String s) {
        answer = s;
    }
}
