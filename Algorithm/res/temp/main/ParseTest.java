package temp.main;

import temp.Grammar;
import temp.ParsedFileContainer;
import temp.SyntaxTree;
import drjava.antlr4.c.CLexer;
import drjava.antlr4.c.CParser;
import drjava.antlr4.cpp.CPP14Lexer;
import drjava.antlr4.cpp.CPP14Parser;
import drjava.antlr4.java8.Java8Lexer;
import drjava.antlr4.java8.Java8Parser;
import temp.gui.MultiTreeFrame;
import temp.io.SourceFile;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.Parser;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.Tree;

import java.io.File;
import java.io.IOException;

public class ParseTest {

    public static void main(String ... args) {
        try {

            String[] filePaths = new String[] {
                    "res/HelloWorld.c",
                    "res/HelloWorld.cpp",
                    "res/HelloWorld.java"
            };

            File f;
            ParsedFileContainer[] parsedFiles = new ParsedFileContainer[filePaths.length];
            String[] labels = new String[filePaths.length];
            String[][] ruleNames = new String[filePaths.length][];
            Tree[] trees = new Tree[filePaths.length];

            for (int i=0; i<filePaths.length; i++) {
                f = new File(filePaths[i]);
                parsedFiles[i] = parseFile(new SourceFile(f, getGrammarByExtension(f)));

                labels[i] = parsedFiles[i].getFile().getGrammar().toString();
                ruleNames[i] = parsedFiles[i].getParser().getRuleNames();
                trees[i] = parsedFiles[i].getSyntaxTree();

            }

//            trees[1] = parsedFiles[1].getParseTree();

            MultiTreeFrame frame = new MultiTreeFrame(labels, ruleNames, trees);
            frame.launch("[C, C++, Java] -> Hello World!");


        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static ParsedFileContainer parseFile(SourceFile file) throws IOException {
        Lexer lexer;
        CommonTokenStream tokens;
        Parser parser;
        ParseTree parseTree;

        switch(file.getGrammar()) {
            case C:
                lexer = new CLexer(file.getCharStream());
                tokens = new CommonTokenStream(lexer);
                parser = new CParser(tokens);
                parseTree = ((CParser) parser).translationUnit();
                break;

            case CPP:
                lexer = new CPP14Lexer(file.getCharStream());
                tokens = new CommonTokenStream(lexer);
                parser = new CPP14Parser(tokens);
                parseTree = ((CPP14Parser) parser).translationunit();
                break;

            case JAVA:
                lexer = new Java8Lexer(file.getCharStream());
                tokens = new CommonTokenStream(lexer);
                parser = new Java8Parser(tokens);
                parseTree = ((Java8Parser) parser).compilationUnit();
                break;

            default:
                throw new UnsupportedOperationException("Grammar not supported [" + file.getGrammar() + "]");

        }

        return new ParsedFileContainer(file, lexer, tokens, parser, parseTree, SyntaxTree.Build(parseTree));

    }

    public static Grammar getGrammarByExtension(File file) {
        String extension = file.getName().substring(file.getName().lastIndexOf("."));

        for (Grammar g : Grammar.values()) {
            if(g.getExtension().equalsIgnoreCase(extension))
                return g;
        }

        return null;
    }

}
