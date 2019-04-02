package drjava.parser;

import drjava.antlr4.c.CLexer;
import drjava.antlr4.c.CParser;
import drjava.antlr4.cpp.CPP14Lexer;
import drjava.antlr4.cpp.CPP14Parser;
import drjava.antlr4.java8.Java8Lexer;
import drjava.antlr4.java8.Java8Parser;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.ParseTree;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class FileParser {

    private final File file;

    public FileParser(File file) {
        this.file = file;
    }

    public static String[] getRuleNames(Grammar grammar) {
        switch (grammar) {
            case C:
                return CParser.ruleNames;

            case CPP:
                return CPP14Parser.ruleNames;

            case JAVA:
                return Java8Parser.ruleNames;

            default:
                // TODO - Create & Throw GrammarNotFoundException
                return null;
        }

    }

    public String[] getRuleNames() {
        return FileParser.getRuleNames(Grammar.fromFile(file));
    }

    public ParseTree getParseTree() throws IOException {

        FileInputStream fileInputStream = new FileInputStream(file);
        CharStream charStream = CharStreams.fromStream(fileInputStream);

        Lexer lexer;
        TokenStream tokenStream;
        Parser parser;

        switch (Grammar.fromFile(file)) {
            case C:
                lexer = new CLexer(charStream);
                tokenStream = new CommonTokenStream(lexer);
                parser = new CParser(tokenStream);
                return ((CParser) parser).translationUnit();

            case CPP:
                lexer = new CPP14Lexer(charStream);
                tokenStream = new CommonTokenStream(lexer);
                parser = new CPP14Parser(tokenStream);
                return ((CPP14Parser) parser).translationunit();

            case JAVA:
                lexer = new Java8Lexer(charStream);
                tokenStream = new CommonTokenStream(lexer);
                parser = new Java8Parser(tokenStream);
                return ((Java8Parser) parser).compilationUnit();

            default:
                // TODO - Create & Throw GrammarNotFoundException
                return null;
        }

    }

}