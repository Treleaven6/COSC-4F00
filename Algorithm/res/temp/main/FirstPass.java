package temp.main;

import drjava.antlr4.java8.Java8Lexer;
import drjava.antlr4.java8.Java8Parser;
import temp.gui.TreeFrame;
import temp.io.SourceFile;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.tree.Tree;

import java.io.IOException;

public class FirstPass {


    public FirstPass(String filepath) {

        SourceFile file = new SourceFile(filepath);
        Java8Lexer lexer = null;

        try {
            lexer = new Java8Lexer(file.getCharStream());
            TokenStream tokens = new CommonTokenStream(lexer);
            Java8Parser parser = new Java8Parser(tokens);

            MyTree tree = MyTree.Build(parser.compilationUnit());

            TreeFrame frame = new TreeFrame("Java8", parser.getRuleNames(), tree);
            frame.launch("Java8 Cleaning Tree");


            System.out.println("\n\n");
//            traverseTree(tree);

        } catch (IOException e) {
            e.printStackTrace();
        }



    }

    public void traverseTree(Tree tree) {

        System.out.print(tree.getPayload() + " ");
        for (int i=0; i<tree.getChildCount(); i++) {
            traverseTree(tree.getChild(i));
        }

    }




    public static void main(String ... args) {

        String filepath = "res/BusRoute.java";

        new FirstPass(filepath);

    }
}
