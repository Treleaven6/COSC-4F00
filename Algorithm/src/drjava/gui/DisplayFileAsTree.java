package drjava.gui;

import drjava.parser.FileParser;
import drjava.parser.Grammar;
import org.antlr.v4.runtime.tree.ParseTree;

import java.io.File;
import java.io.IOException;

public class DisplayFileAsTree {

    public DisplayFileAsTree(File file) {

        try {

            FileParser fileParser = new FileParser(file);
            ParseTree parseTree = fileParser.getParseTree();
            new DisplayTree(file.getName(), Grammar.fromFile(file), parseTree);

        } catch (IOException e) {
            e.printStackTrace();
        }


    }

}
