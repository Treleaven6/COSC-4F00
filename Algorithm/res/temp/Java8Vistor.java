package temp;

import drjava.antlr4.java8.Java8BaseVisitor;
import temp.io.FileParser;

public class Java8Vistor extends Java8BaseVisitor {

    private FileParser fileParser;

    public Java8Vistor(FileParser fileParser ) {
        this.fileParser = fileParser;
    }




    public static void main(String ... args) {

    }

}
