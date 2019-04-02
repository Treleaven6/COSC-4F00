package temp.main;

import temp.Grammar;
import temp.ParsedFileContainer;
import temp.gui.TreeFrame;
import temp.io.SourceFile;
import org.antlr.v4.runtime.tree.Tree;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class VariableTest {

    List<String> ruleNameList;

    StringBuilder stringBuilder;

    public VariableTest() {

        try {

            SourceFile file = new SourceFile(new File("res/Variable.java"), Grammar.JAVA);
            ParsedFileContainer parseData = ParseTest.parseFile(file);

            Tree parseTree = parseData.getParseTree();
            Tree syntaxTree = parseData.getSyntaxTree();

            ruleNameList = Arrays.asList(parseData.getParser().getRuleNames());
            stringBuilder = new StringBuilder();
            TreeFrame.launch(file, parseData.getParser().getRuleNames(), syntaxTree);


            traverseTree(syntaxTree);

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public void traverseTree(Tree tree) {

        if (tree.getChildCount() == 0) {
            stringBuilder.append(tree.getPayload());                                                           
        } else {

            StringBuilder shallowNodeString = new StringBuilder();
            for (int i = 0; i < tree.getChildCount(); i++) {
                if (tree.getChild(i).getChildCount() != 1) {
                    shallowNodeString.delete(0, shallowNodeString.length());
                    break;
                }
                shallowNodeString.append(tree.getChild(0).getPayload());
            }

            for (int i = 0; i < tree.getChildCount(); i++) {
                traverseTree(tree.getChild(i));
            }

            if (shallowNodeString.length() != 0) {
                stringBuilder.append(shallowNodeString);
            } else {
                System.out.println(stringBuilder);
                stringBuilder.delete(0, stringBuilder.length());
            }
        }
    }

    public static void main(String ... args) { new VariableTest(); }

}
