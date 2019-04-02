import java.io.*;

public class Variable {


    public static String STATIC_VAR_1 = "THIS IS A STRING!";

    private int width;
    private int height;

    public Variable() {
        this.width = 100;
        this.height = 125;

        System.out.println(width + " x " + height);
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public static void main(String ... args) {

        File file = new File("res/BusRoute.java");
        printFile(file);

        Variable var = new Variable();
        var.setWidth(200);

        System.out.println(var.width + " x " + var.height);
    }

    public static void printFile(File file) {
        try (BufferedReader reader = new BufferedReader(new FileReader(file));){
            reader.lines().forEach(System.out::println);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



}
