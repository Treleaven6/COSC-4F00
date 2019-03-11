/*Tina Pazaj
Student # 5550827
COSC 3P71
Assignment 2
 */

import java.io.File;
import java.util.*;

public class TSP { //Traveling Salesman problem

    public static void main(String[] args) {
        try {
            //read coordinates
            Scanner sc = new Scanner(new File("eil51.tsp")); //scan and read the tsp file **CHANGE THE TSP FILE
            String read = sc.nextLine();
            while (!read.startsWith("DIMENSION")) {
                read = sc.nextLine();
            }
            String[] sp = read.split(" ");
            int count = Integer.parseInt(sp[sp.length - 1]);
            while (!read.equals("NODE_COORD_SECTION")) {
                read = sc.nextLine();
            }
            double[][] coordinates = new double[count][];
            for (int i = 0; i < count; i++) {
                sc.nextInt();
                coordinates[i] = new double[2];
                coordinates[i][0] = sc.nextDouble();
                coordinates[i][1] = sc.nextDouble();
            }
            sc.close();
            //1
            int num_iterations = 60; //# of generations
            int tournamentSize = 20;
            int randomSeed = 700;
            int Pop_Size = 500;
            double crossoverRate = 2.0;
            double mutation = 0.1;
            System.out.println("Pop size: " + Pop_Size + ", tournamentSize: " + tournamentSize + ", crossoverRate: " + crossoverRate + ", mutation: " + mutation + ", randomSeed: " + randomSeed);
            TSP tsp = new TSP(coordinates, Pop_Size, tournamentSize, crossoverRate, mutation, randomSeed);
            for (int i = 0; i < num_iterations; i++) {
                tsp.evolvePopulation();
                System.out.println("Best fitness value: " + tsp.getFittest().fitness + ", average fitness value: " + tsp.getAverageFitness());
            }
            System.out.println("best chromosome: " + tsp.getFittest().toString());
            System.out.println();
            //2
            crossoverRate = 1.0;
            mutation = 0.1;
            System.out.println("Pop size: " + Pop_Size + ", tournamentSize: " + tournamentSize + ", crossoverRate: " + crossoverRate + ", mutation: " + mutation + ", randomSeed: " + randomSeed);
            tsp = new TSP(coordinates, Pop_Size, tournamentSize, crossoverRate, mutation, randomSeed);
            for (int i = 0; i < num_iterations; i++) {
                tsp.evolvePopulation();
                System.out.println("best fitness value: " + tsp.getFittest().fitness + ", average fitness value: " + tsp.getAverageFitness());
            }
            System.out.println("best chromosome: " + tsp.getFittest().toString());
            System.out.println();
            //3
            crossoverRate = 0.9;
            mutation = 0.0;
            System.out.println("Pop size: " + Pop_Size + ", tournamentSize: " + tournamentSize + ", crossoverRate: " + crossoverRate + ", mutation: " + mutation + ", randomSeed: " + randomSeed);
            tsp = new TSP(coordinates, Pop_Size, tournamentSize, crossoverRate, mutation, randomSeed);
            for (int i = 0; i < num_iterations; i++) {
                tsp.evolvePopulation();
                System.out.println("best fitness value: " + tsp.getFittest().fitness + ", average fitness value: " + tsp.getAverageFitness());
            }
            System.out.println("best chromosome: " + tsp.getFittest().toString());
            System.out.println();
            //4
            crossoverRate = 0.9;
            mutation = 0.1;
            System.out.println("Pop size: " + Pop_Size + ", tournamentSize: " + tournamentSize + ", crossoverRate: " + crossoverRate + ", mutation: " + mutation + ", randomSeed: " + randomSeed);
            tsp = new TSP(coordinates, Pop_Size, tournamentSize, crossoverRate, mutation, randomSeed);
            for (int i = 0; i < num_iterations; i++) {
                tsp.evolvePopulation();
                System.out.println("best fitness value: " + tsp.getFittest().fitness + ", average fitness value: " + tsp.getAverageFitness());
            }
            System.out.println("best chromosome: " + tsp.getFittest().toString());
            System.out.println();
            //5
            crossoverRate = 0.93;
            mutation = 0.01;
            System.out.println("Pop size: " + Pop_Size + ", tournamentSize: " + tournamentSize + ", crossoverRate: " + crossoverRate + ", mutation: " + mutation + ", randomSeed: " + randomSeed);
            tsp = new TSP(coordinates, Pop_Size, tournamentSize, crossoverRate, mutation, randomSeed);
            for (int i = 0; i < num_iterations; i++) {
                tsp.evolvePopulation();
                System.out.println("best fitness value: " + tsp.getFittest().fitness + ", average fitness value: " + tsp.getAverageFitness());
            }
            System.out.println("best chromosome: " + tsp.getFittest().toString());
            System.out.println();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Chromosome[] population;
    private double[][] coordinates;
    private int tournamentSize;
    private double mutation;
    private int elitismCount;
    private Random random;

    public TSP(double[][] coordinates, int Pop_Size, int tournamentSize, double crossoverRate, double mutation, int randomSeed) {
        this.random = new Random(randomSeed);
        this.coordinates = coordinates;
        this.tournamentSize = tournamentSize;
        elitismCount = (int) ((1 - crossoverRate) * coordinates.length);
        if (elitismCount > coordinates.length) elitismCount = coordinates.length;
        if (elitismCount < 1) elitismCount = 1;
        this.mutation = mutation;
        population = genNewPop(coordinates.length, Pop_Size);
    }

    //generate random population
    public Chromosome[] genNewPop(int genSize, int Pop_Size) {
        Chromosome[] population = new Chromosome[Pop_Size];
        for (int i = 0; i < Pop_Size; i++) {
            population[i] = randomGen(genSize);
        }
        return population;
    }

    public Chromosome randomGen(int genSize) {
        int[] points = new int[genSize];
        for (int i = 1; i <= genSize; i++) {
            int pos = random.nextInt(genSize);
            while (points[pos] != 0) {
                pos++;
                pos %= genSize;
            }
            points[pos] = i;
        }
        return new Chromosome(points);
    }

    //return the most fit chromosome from tournamentSize's random chromosomes taken from population
    private Chromosome tournamentSelection() {
        Chromosome fittest = population[random.nextInt(population.length)];
        for (int i = 0; i < tournamentSize - 1; i++) {
            Chromosome randomChromosome = population[random.nextInt(population.length)];
            //choose fittest chromosome
            if (randomChromosome.fitness < fittest.fitness)
                fittest = randomChromosome;
        }
        return fittest;
    }

    private static double distance(double[] a, double[] b) {
        double xD = a[0] - b[0];
        double yD = a[0] - b[0];
        return Math.sqrt((xD * xD) + (yD * yD));
    }

    private void evolvePopulation() {
        Chromosome[] newPopulation = new Chromosome[population.length];

        //this is elitism - replicated the best chromosomes to the next generation
        if (elitismCount > 1) {
            PriorityQueue<Chromosome> queue = new PriorityQueue<>(Arrays.asList(population));
            for (int i = 0; i < elitismCount; i++) {
                newPopulation[i] = queue.poll();
            }
        } else {
            newPopulation[0] = getFittest();
        }

        //crossover and mutation
        for (int i = elitismCount; i < population.length; i++) {
            Chromosome chromosome1 = tournamentSelection();
            Chromosome chromosome2 = tournamentSelection();
            if (chromosome1 == chromosome2) {
                newPopulation[i] = chromosome1;
            } else
                newPopulation[i] = crossover(chromosome1, chromosome2); //CHANGE CROSSOVER HERE, FOR UNIFORM ORDER CROSSOVER CHANGE newPopulation to "crossover",
            // FOR ORDER CROSSOVER CHANGE newPopulation TO "orderCrossover"
            newPopulation[i] = mutation(newPopulation[i]);
        }
        population = newPopulation;
    }

    //uniform order crossover
    private Chromosome crossover(Chromosome chromosome1, Chromosome chromosome2) {
        int[] child = new int[coordinates.length];
        HashSet<Integer> pointsInChild = new HashSet<>();
        List<Integer> pointsNotInChild = new LinkedList<>();
        for (int point : chromosome1.points) {
            pointsNotInChild.add(point);
        }
        boolean[] bitMask = generateBitMask(coordinates.length);

        for (int i = 0; i < coordinates.length; i++) {
            //add a point to the population from the first chromosome if bitMask  in current position is equal to True
            // otherwise, from second chromosome
            //if point already in population then add a point from another chromosome or from the list of points that
            // are not in population
            if (bitMask[i]) {
                insertPoint(chromosome2, chromosome1, child, pointsInChild, pointsNotInChild, i);
            } else {
                insertPoint(chromosome1, chromosome2, child, pointsInChild, pointsNotInChild, i);
            }
        }
        return new Chromosome(child);
    }


    //order crossover
    private Chromosome orderCrossover(Chromosome chromosome1, Chromosome chromosome2) {
        int[] child = new int[coordinates.length];
        HashSet<Integer> pointsInChild = new HashSet<>();
        List<Integer> pointsNotInChild = new LinkedList<>();

        int n = chromosome1.points.length;
        int firstPoint = random.nextInt(n);
        int secondPoint = random.nextInt(n - firstPoint) + firstPoint;

        //inherit the points before firstPoint and after secondPoint
        for (int i = 0; i < firstPoint; i++) {
            child[i] = chromosome1.points[i];
            pointsInChild.add(chromosome1.points[i]);
        }
        for (int i = secondPoint; i < n; i++) {
            child[i] = chromosome1.points[i];
            pointsInChild.add(chromosome1.points[i]);
        }

        //Get the points of the opposite parent if the new population does not already contain them
        for (int i = firstPoint; i < secondPoint; i++) {
            if (!pointsInChild.contains(chromosome2.points[i])) {
                pointsInChild.add(chromosome2.points[i]);
                child[i] = chromosome2.points[i];
            }
        }
        for (int i = 0; i < n; i++) {
            if (!pointsInChild.contains(chromosome2.points[i])) {
                pointsNotInChild.add(chromosome2.points[i]);
            }
        }
        ArrayList<Integer> emptySpots = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (child[i] == 0) {
                emptySpots.add(i);
            }
        }
        for (Integer point : pointsNotInChild) {
            child[emptySpots.remove(0)] = point;
        }

        return new Chromosome(child);
    }

    //additional method for uniform order crossover - add a point to the population from the first chromosome
    // if the point is already in the population then add a point from another chromosome
    // or from the list of points that are not in population
    private void insertPoint(Chromosome chromosome1, Chromosome chromosome2, int[] child, HashSet<Integer> pointsInChild, List<Integer> pointsNotInChild, int i) {
        if (pointsInChild.contains(chromosome2.points[i])) {
            if (pointsInChild.contains(chromosome1.points[i])) {
                child[i] = pointsNotInChild.remove(0);
            } else {
                child[i] = chromosome1.points[i];
                pointsNotInChild.remove((Integer) child[i]);
            }
        } else {
            child[i] = chromosome2.points[i];
            pointsNotInChild.remove((Integer) child[i]);
        }
        pointsInChild.add(child[i]);
    }

    //generate random boolean array
    private boolean[] generateBitMask(int size) {
        boolean[] bitMask = new boolean[size];

        for (int i = 0; i < size; i++) {
            bitMask[i] = random.nextInt(2) == 0;
        }

        return bitMask;
    }


    //add mutation to chromosome
    private Chromosome mutation(Chromosome chromosome) {
        int[] points = Arrays.copyOf(chromosome.points, chromosome.points.length);
        for (int i = 0; i < mutation * points.length; i++) {
            //get 2 random points
            int r1 = random.nextInt(points.length);
            int r2 = random.nextInt(points.length);
            //swap points
            int t = points[r1];
            points[r1] = points[r2];
            points[r2] = t;
        }
        return new Chromosome(points);
    }

    //get the fittest chromosome in population
    private Chromosome getFittest() {
        Chromosome fittest = population[0];
        for (int i = 1; i < population.length; i++) {
            if (fittest.fitness > population[i].fitness) {
                fittest = population[i];
            }
        }
        return fittest;
    }

    //get the getAverage fitness in population
    private double getAverageFitness() {
        double sum = 0;
        for (int i = 0; i < population.length; i++) {
            sum += population[i].fitness;
        }
        return sum / population.length;
    }


    private class Chromosome implements Comparable<Chromosome> {
        public Chromosome(int[] points) {
            this.points = points;
            fitness = 0;
            //compute fitness
            for (int i = 0; i < points.length; i++) {
                fitness += distance(coordinates[points[i] - 1], coordinates[points[(i + 1) % (points.length - 1)] - 1]);
            }
        }

        private double fitness;
        private int[] points;

        @Override
        public int compareTo(Chromosome o) {
            return (int) (fitness - o.fitness);
        }

        @Override
        public String toString() {
            return "fitness=" + fitness +
                    ", points=" + Arrays.toString(points);
        }
    }
}