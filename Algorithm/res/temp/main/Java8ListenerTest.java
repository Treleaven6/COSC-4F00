package temp.main;

import drjava.antlr4.java8.Java8BaseListener;
import drjava.antlr4.java8.Java8Lexer;
import drjava.antlr4.java8.Java8Parser;
import temp.io.SourceFile;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.tree.ParseTreeWalker;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

public class Java8ListenerTest extends Java8BaseListener {

    private List<String> variables;
    private List<String> methods;

    public Java8ListenerTest() {
        variables = new LinkedList<>();
        methods = new LinkedList<>();
    }

    @Override
    public void enterVariableDeclaratorId(Java8Parser.VariableDeclaratorIdContext ctx) {
        super.enterVariableDeclaratorId(ctx);
        variables.add(ctx.getText().toLowerCase());
    }

    @Override
    public void enterMethodName(Java8Parser.MethodNameContext ctx) {
        super.enterMethodName(ctx);
        methods.add(ctx.getText());
    }

    @Override
    public void enterMethodDeclaration(Java8Parser.MethodDeclarationContext ctx) {
        super.enterMethodDeclaration(ctx);
//        System.out.printf("%-40s%s%s%n", ctx.getClass().getSimpleName(), ctx.methodHeader().getText(), ctx.methodBody().getText());
    }

    @Override
    public void enterLiteral(Java8Parser.LiteralContext ctx) {
        super.enterLiteral(ctx);
//        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterBlock(Java8Parser.BlockContext ctx) {
        super.enterBlock(ctx);
        System.out.println("Block\t"+ctx.getText());
    }

    @Override
    public void enterBlockStatements(Java8Parser.BlockStatementsContext ctx) {
        super.enterBlockStatements(ctx);
        System.out.println("BlockStmnt\t"+ctx.getText());
    }

    public static void main(String ... args) {

        try {
            SourceFile file = new SourceFile("res/BusRoute.java");
            Java8Lexer lexer = new Java8Lexer(file.getCharStream());
            TokenStream tokens = new CommonTokenStream(lexer);
            Java8Parser parser = new Java8Parser(tokens);

            ParseTreeWalker walker = new ParseTreeWalker();
            Java8ListenerTest extractor = new Java8ListenerTest();
            walker.walk(extractor, parser.compilationUnit());

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}


/*
Unused enter*Variable*

    @Override
    public void enterTypeVariable(Java8Parser.TypeVariableContext ctx) {
        super.enterTypeVariable(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterVariableDeclarator(Java8Parser.VariableDeclaratorContext ctx) {
        super.enterVariableDeclarator(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterVariableDeclaratorList(Java8Parser.VariableDeclaratorListContext ctx) {
        super.enterVariableDeclaratorList(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterVariableInitializer(Java8Parser.VariableInitializerContext ctx) {
        super.enterVariableInitializer(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterVariableInitializerList(Java8Parser.VariableInitializerListContext ctx) {
        super.enterVariableInitializerList(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterLocalVariableDeclarationStatement(Java8Parser.LocalVariableDeclarationStatementContext ctx) {
        super.enterLocalVariableDeclarationStatement(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterLocalVariableDeclaration(Java8Parser.LocalVariableDeclarationContext ctx) {
        super.enterLocalVariableDeclaration(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterUnannTypeVariable(Java8Parser.UnannTypeVariableContext ctx) {
        super.enterUnannTypeVariable(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterVariableModifier(Java8Parser.VariableModifierContext ctx) {
        super.enterVariableModifier(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }
 */

/*
Unused enter*Method*

    @Override
    public void enterMethodHeader(Java8Parser.MethodHeaderContext ctx) {
        super.enterMethodHeader(ctx);
        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }




 */