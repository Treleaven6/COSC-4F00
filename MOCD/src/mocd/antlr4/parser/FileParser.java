package mocd.antlr4.parser;

import mocd.antlr4.listener.PreProcessor;
import mocd.io.SourceFile;
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.Parser;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.io.IOException;
import java.util.ArrayList;

public interface FileParser {

    public void process();

    public SourceFile getSourceFile();

    Lexer getLexer();

    TokenStream getTokenStream();

    Parser getParser();

    ParseTree getParseTree();

    PreProcessor getPreProcessor();

    ArrayList<TerminalNode> getProcessedNodes();

    static FileParser Parse(SourceFile file) throws IOException {

        switch (file.getGrammar()) {
            case C:
                return new C11FileParser(file);

            case CPP:
                return new CPP14FileParser(file);

            case JAVA:
                return new Java8FileParser(file);

            default:
                throw new IOException("Grammar Not Found"); // TODO - Setup GrammarNotFoundException

        }

    }

}
