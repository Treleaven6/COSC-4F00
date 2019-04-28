package mocd.antlr4.listener;

import mocd.antlr4.generated.java8.Java8BaseListener;
import mocd.antlr4.generated.java8.Java8Parser;
import org.antlr.v4.runtime.CommonToken;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.util.ArrayList;

public class Java8PreProcessor extends Java8BaseListener implements PreProcessor{

    private final ArrayList<TerminalNode> nodeList = new ArrayList<>();

    @Override
    public ArrayList<TerminalNode> getNodeList() {
        return this.nodeList;
    }

    @Override
    public void enterPackageName(Java8Parser.PackageNameContext ctx) {
        super.enterPackageName(ctx);
        // Renames Package Identifiers
        ((CommonToken) ctx.Identifier().getSymbol()).setText("I");
    }

    @Override
    public void enterNormalClassDeclaration(Java8Parser.NormalClassDeclarationContext ctx) {
        super.enterNormalClassDeclaration(ctx);
        // Rename Class Identifiers
        ((CommonToken) ctx.Identifier().getSymbol()).setText("I");
    }

    @Override
    public void enterSimpleTypeName(Java8Parser.SimpleTypeNameContext ctx) {
        super.enterSimpleTypeName(ctx);
        // Rename SimpleType Identifiers
        ((CommonToken) ctx.Identifier().getSymbol()).setText("I");
    }

    @Override
    public void enterVariableDeclaratorId(Java8Parser.VariableDeclaratorIdContext ctx) {
        super.enterVariableDeclaratorId(ctx);
        // Rename Variable Identifiers
        ((CommonToken) ctx.Identifier().getSymbol()).setText("I");
    }

    @Override
    public void enterExpressionName(Java8Parser.ExpressionNameContext ctx) {
        super.enterExpressionName(ctx);
        ((CommonToken) ctx.Identifier().getSymbol()).setText("I");
    }

    @Override
    public void enterTypeName(Java8Parser.TypeNameContext ctx) {
        super.enterTypeName(ctx);

        switch (ctx.getText()) {
            case "Math":
            case "System.out":
                break;
            default:
                ((CommonToken) ctx.Identifier().getSymbol()).setText("I");
        }
    }

    @Override
    public void enterFieldAccess(Java8Parser.FieldAccessContext ctx) {
        super.enterFieldAccess(ctx);
        ((CommonToken) ctx.Identifier().getSymbol()).setText("I");
    }

    @Override
    public void enterFieldAccess_lf_primary(Java8Parser.FieldAccess_lf_primaryContext ctx) {
        super.enterFieldAccess_lf_primary(ctx);
        ((CommonToken) ctx.Identifier().getSymbol()).setText("I");
    }

    @Override
    public void enterLiteral(Java8Parser.LiteralContext ctx) {
        super.enterLiteral(ctx);
        // Renames Strings to S
        if (ctx.StringLiteral() != null) {
            ((CommonToken) ctx.StringLiteral().getSymbol()).setText("S");
        }
    }

    @Override
    public void enterMethodDeclarator(Java8Parser.MethodDeclaratorContext ctx) {
        super.enterMethodDeclarator(ctx);
        // Rename Methods to M
        ((CommonToken) ctx.Identifier().getSymbol()).setText("M");
    }

    @Override
    public void enterMethodName(Java8Parser.MethodNameContext ctx) {
        super.enterMethodName(ctx);
        // Rename Methods to M
        ((CommonToken) ctx.Identifier().getSymbol()).setText("M");
    }




    @Override
    public void visitTerminal(TerminalNode node) {
        super.visitTerminal(node);

        switch (node.getSymbol().getType()) {
            case -1:    // EOF  - End Of File
            case 43:    // this - Keyword "this"
            case 57:    // (    - Left Parentheses
            case 58:    // )    - Right Parentheses
            case 59:    // {    - Left Curli Bracket
            case 60:    // }    - Right Curli Bracket
            case 63:    // ;    - Semicolon
            case 64:    // ,    - Comma
            case 65:    // .    - Period
//            case 67:    // >  - Greater Than
//            case 68:    // <  - Less Than
                ((CommonToken) node.getSymbol()).setText("");
                break;

            default:
                if (node.getText().length() > 1) {
                    ((CommonToken) node.getSymbol()).setText(node.getText().toLowerCase());
                }

        }

        if (node.getText().length() > 0) {
            nodeList.add(node);
        }
    }


}