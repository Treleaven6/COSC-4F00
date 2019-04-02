package temp.main;

import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.Tree;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class MyTree implements Tree {

    private static final List<String> MODIFIER_CONTEXTS = new LinkedList<>(Arrays.asList(
        "ClassModifierContext",
        "MethodModifierContext",
        "FieldModifierContext"
    ));

    private static final List<String> IGNORE_RULES = new LinkedList<>(Arrays.asList(
            "PackageDeclarationContext",
            "ImportDeclarationContext",


            "TypeArgumentsOrDiamondContext"
    ));

    public static MyTree Build(ParseTree tree) {
        MyTree root = new MyTree(null, tree.getClass().getSimpleName().toLowerCase(), null);
        populateNodes(root, tree);

        return root;
    }

    private static void populateNodes(MyTree parent, ParseTree tree) {

        String context = tree.getClass().getSimpleName();

        String payload;
        MyTree node;
        
        if (MODIFIER_CONTEXTS.contains(context)) {
            return;
        } else if (tree.getChildCount() == 0) {
            switch(context = tree.getParent().getClass().getSimpleName().toLowerCase()) {

                case "methodnamecontext":
                    payload = "M";
                    break;

                case "variabledeclaratoridcontext":
                case "typenamecontext":
                case "expressionnamecontext":
                case "fieldaccesscontext":
                    payload = "V";
                    break;

                default:
                    payload = tree.getText();

            }

            System.out.printf("%-60s%s%n", context, payload);
        } else {
            payload = tree.getClass().getSimpleName();
        }



//        if (tree.getChildCount() == 1) {
//            switch(context = tree.getParent().getClass().getSimpleName().toLowerCase()) {
//
//                case "methodnamecontext":
//                    payload = "M";
//                    break;
//
//                case "variabledeclaratoridcontext":
//                    payload = "V";
//                    break;
//
//                default:
//                    payload = tree.getClass().getSimpleName().toLowerCase();
//
//            }
//        } else {
//            context = tree.getClass().getSimpleName().toLowerCase();
//            payload = tree.getText();
//        }

//        System.out.printf("%-60s%s%n", context, tree.getText());

        node = new MyTree(parent, payload, null);
        parent.children.add(node);

        if (tree.getChildCount() != 0) {


            for (int i = 0; i < tree.getChildCount(); i++) {
                populateNodes(node, tree.getChild(i));
            }
        }



    }


    private final Tree parent;
    private final Object payload;
    private final List<Tree> children;

    private MyTree(MyTree parent, Object payload, List<Tree> children) {
        this.parent = parent;
        this.payload = payload;
        this.children = (children==null) ? new LinkedList<Tree>() : children;
    }

    @Override
    public Tree getParent() {
        return this.parent;
    }

    @Override
    public Object getPayload() {
        return this.payload;
    }

    @Override
    public Tree getChild(int i) {
        return children.get(i);
    }

    @Override
    public int getChildCount() {
        return children.size();
    }

    @Override
    public String toStringTree() {
        return payload.toString();
    }

}


//        if (IGNORE_RULES.contains(tree.getClass().getSimpleName())) {
//            return;
//
//      Flattens the tree
//        } else if (tree.getChildCount() == 1) {
//            populateNodes(parent, tree.getChild(0));
//
//        } else if (tree.getChildCount() == 0) {
//
//            MyTree node;
//
//            if (tree.getParent().getClass().getSimpleName().equalsIgnoreCase("VariableDeclaratorIdContext")
//                || VARIABLES_IDENTIFIERS.contains(tree.getText())) {
//                VARIABLES_IDENTIFIERS.add(tree.getText());
//                node = new MyTree(parent, "V", null);
//
//            } if else (tree.getParent().getClass().getSimpleName().equalsIgnoreCase("MethodDeclarationContext"))
//
//            }
//            else
//            } {
//
//            }
//
//            parent.children.add(node);
//
//            System.out.printf("%-60s%s%n", tree.getParent().getClass().getSimpleName(), node.toStringTree());
//
//        } else {
//            MyTree node = new MyTree(parent, tree.getClass().getSimpleName(), null);
//            parent.children.add(node);
//
//            for (int i=0; i<tree.getChildCount(); i++) {
//                populateNodes(node, tree.getChild(i));
//            }
//        }