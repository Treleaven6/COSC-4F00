package drjava.test;

import drjava.antlr4.java8.Java8BaseListener;
import drjava.antlr4.java8.Java8Parser;

public class Java8TestListener extends Java8BaseListener {

    @Override
    public void enterVariableDeclaratorId(Java8Parser.VariableDeclaratorIdContext ctx) {
        super.enterVariableDeclaratorId(ctx);
//        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterFieldAccess(Java8Parser.FieldAccessContext ctx) {
        super.enterFieldAccess(ctx);
//        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterExpressionName(Java8Parser.ExpressionNameContext ctx) {
        super.enterExpressionName(ctx);
//        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterTypeName(Java8Parser.TypeNameContext ctx) {
        super.enterTypeName(ctx);
//        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterPrimary(Java8Parser.PrimaryContext ctx) {
        super.enterPrimary(ctx);
//        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterMethodName(Java8Parser.MethodNameContext ctx) {
        super.enterMethodName(ctx);
//        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterMethodInvocation(Java8Parser.MethodInvocationContext ctx) {
        super.enterMethodInvocation(ctx);
//        System.out.printf("%-40s%s%n", ctx.getClass().getSimpleName(), ctx.getText());
    }

    @Override
    public void enterMethodInvocation_lf_primary(Java8Parser.MethodInvocation_lf_primaryContext ctx) {
        super.enterMethodInvocation_lf_primary(ctx);

        StringBuilder stringBuilder = new StringBuilder();
        for (int i=0; i<ctx.getChildCount(); i++) {
            stringBuilder.append(ctx.getChild(i).getText() + "  ");
        }

        System.out.printf("%-40s%-80s%s%n", ctx.getClass().getSimpleName(), ctx.getText(), stringBuilder.toString());
    }

    @Override
    public void enterMethodInvocation_lfno_primary(Java8Parser.MethodInvocation_lfno_primaryContext ctx) {
        super.enterMethodInvocation_lfno_primary(ctx);

        StringBuilder stringBuilder = new StringBuilder();
        for (int i=0; i<ctx.getChildCount(); i++) {
            stringBuilder.append(ctx.getChild(i).getText() + "  ");
        }
        System.out.printf("%-40s%-80s%s%n", ctx.getClass().getSimpleName(), ctx.getText(), stringBuilder.toString());
    }
}

/*
    Look into:

        TypeNameContext
        MethodInvocation_Ifno_

 */