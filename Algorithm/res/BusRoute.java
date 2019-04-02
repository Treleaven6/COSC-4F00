package busroute;

import java.util.*;
import main.InputScanner;

public class BusRoute {

    private Map<Integer, Double> prices = new HashMap<>();          // Map<Miles, Prices>
    private Map<Integer, Double> preCalculated = new HashMap<>();   // Stored Values
    private Integer m = null;                                       // Distance a Bus can travel
    private Integer n = null;                                       // Distance of trip

    public BusRoute(InputScanner in) {

        Double tempDouble;  // Used to check if input was q (for quitting)

        // Request m (Distance a bus may travel)
        tempDouble = in.getDouble("Max distance a bus can travel? (m = ?)");
        if(tempDouble!=null) this.m = tempDouble.intValue();

        // Build PriceMap (Option to use mine or input the values - uncomment the block to input your own values)
        prices = buildPriceTable(); // <--- comment this line if you're inputting values
        /** ///<--- remove space to uncomment
        for(int i=1; i<=m; i++) {
            tempDouble = getDouble(in, String.format("How much for %d %s?", i, i==1?"Mile":"Miles"));
            if (tempDouble==null) break;
            this.prices.put(i, tempDouble);
        }
        /**/

        while(this.m != null) {
            // Request n (Distance to travel)
            tempDouble = in.getDouble("How far would you like to travel? [n = ?] (q - quit)");
            if(tempDouble==null) break;
            n = Math.abs(tempDouble.intValue());

            // Calculate Cost
            System.out.printf("Total Cost: $%.2f%n%n",getCost(n));
        }
        System.out.println();
    }

    public Double getCost(int distance) {

        double best;    // tracks the best cost

        // O(n) -> n is the distance
        for (int i=1; i<=distance; i++) {

            // Lookup price or set to infinity
            best = prices.containsKey(i)?prices.get(i):Double.MAX_VALUE;

            // O(1/2 n)
            for (int j=1; j<i; j++) {
                // Compare costs with previously calculated values
                best = Math.min(best, preCalculated.get(j)+preCalculated.get(i-j));
            }

            // Store value for future lookups
            preCalculated.put(i, best);

        }

        return preCalculated.get(distance);
    }

    /**
     * Decide on pricing per mile
     * @return  PriceMap
     */
    private Map buildPriceTable() {

        HashMap<Integer, Double> prices = new HashMap<>();

        prices.put(1, 1.25);    // +1.25
        prices.put(2, 1.25);    // +0.00
        prices.put(3, 1.75);    // +0.50
        prices.put(4, 2.25);    // +0.50
        prices.put(5, 2.70);    // +0.45
        prices.put(6,3.00);     // +0.30
        prices.put(7, 4.25);    // +0.25
        prices.put(8, 4.50);    // +0.25
        prices.put(9, 4.75);    // +0.25
        prices.put(10, 5.00);   // +0.25
        prices.put(11, 3.00);   // -2.00
        prices.put(12, 4.50);   // +1.50

        return prices;
    }
}
