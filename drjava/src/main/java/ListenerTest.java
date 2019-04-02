import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.ParseTreeWalker;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class ListenerTest extends Java8BaseListener {

    Java8Lexer lexer;
    Java8Parser parser;

    public static void main(String ... args) throws IOException {

        File file = new File("C:\\Users\\jesse\\OneDrive\\WorkSpace\\COSC-4F00\\drjava\\src\\main\\resources\\HelloWorld.java");
        Java8Lexer lexer = new Java8Lexer(CharStreams.fromPath(file.toPath()));
        CommonTokenStream tokens = new CommonTokenStream(lexer);
        Java8Parser parser = new Java8Parser(tokens);

        ParseTreeWalker walker = new ParseTreeWalker();
        ListenerTest extractor = new ListenerTest(lexer, parser);
        walker.walk(extractor, parser.compilationUnit());

    }

    public ListenerTest(Java8Lexer lexer, Java8Parser parser) {
        this.lexer = lexer;
        this.parser = parser;
    }

    @Override
    public void enterImportDeclaration(Java8Parser.ImportDeclarationContext ctx) {
        super.enterImportDeclaration(ctx);
        System.out.println(ctx.getText());
    }

    @Override
    public void enterMethodDeclaration(Java8Parser.MethodDeclarationContext ctx) {
        super.enterMethodDeclaration(ctx);

        String modifierStr = "";
        String returnType = ctx.methodHeader().result().getText();
        String identifier = ctx.methodHeader().methodDeclarator().Identifier().getText();


        for (Java8Parser.MethodModifierContext mod : ctx.methodModifier()) {
            modifierStr += mod.getText() + " ";
        }




        System.out.printf("%s%s %s",
                modifierStr,
                returnType,
                identifier
        );


    }
}
