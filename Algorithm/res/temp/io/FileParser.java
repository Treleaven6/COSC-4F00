package temp.io;

import temp.Grammar;
import drjava.antlr4.c.CLexer;
import drjava.antlr4.c.CParser;
import drjava.antlr4.cpp.CPP14Lexer;
import drjava.antlr4.cpp.CPP14Parser;
import drjava.antlr4.java8.Java8Lexer;
import drjava.antlr4.java8.Java8Parser;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.ParseTree;

import java.io.IOException;

public class FileParser {

    private static final int GRAMMAR_NOT_FOUND_EXCEPTION = 1;

    private SourceFile file;
    private Grammar grammar;
    private Lexer lexer;
    private TokenStream tokens;
    private Parser parser;
    private ParseTree parseTree;


    public FileParser(String path) {

        try {

            file = new SourceFile(path);
            CharStream stream = file.getCharStream();

            grammar = file.getGrammar();
            if (grammar == null) {
                throw new IOException("Grammar not found!");
            }

            lexer = getLexer(grammar, stream);
            if (lexer == null) {
                throw new IOException("Lexer not supported!");
            }

            tokens = new CommonTokenStream(lexer);

            parser = getParser(grammar, tokens);
            if (parser == null) {
                throw new IOException("Parser not supported!");
            }

            parseTree = getParseTree(grammar, parser);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    public static Lexer getLexer(Grammar grammar, CharStream stream) {
        switch (grammar) {
            case C:
                return new CLexer(stream);

            case CPP:
                return new CPP14Lexer(stream);

            case JAVA:
                return new Java8Lexer(stream);

            default:
                return null;
        }
    }

    public static Parser getParser(Grammar grammar, TokenStream tokens) {
        switch (grammar) {
            case C:
                return new CParser(tokens);

            case CPP:
                return new CPP14Parser(tokens);

            case JAVA:
                return new Java8Parser(tokens);

            default:
                return null;
        }
    }

    public static ParseTree getParseTree(Grammar grammar, Parser parser) {
        switch(grammar) {
            case C:
                return ((CParser) parser).translationUnit();

            case CPP:
                return ((CPP14Parser) parser).translationunit();

            case JAVA:
                return ((Java8Parser) parser).compilationUnit();

            default:
                return null;
        }
    }

    public SourceFile getFile() {
        return file;
    }

    public Grammar getGrammar() {
        return grammar;
    }

    public Lexer getLexer() {
        return lexer;
    }

    public TokenStream getTokens() {
        return tokens;
    }

    public Parser getParser() {
        return parser;
    }

    public ParseTree getParseTree() {
        return parseTree;
    }
}

