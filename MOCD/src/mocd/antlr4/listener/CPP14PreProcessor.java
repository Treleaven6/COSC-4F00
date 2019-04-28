package mocd.antlr4.listener;

import mocd.antlr4.generated.cpp.CPP14BaseListener;
import org.antlr.v4.runtime.CommonToken;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.util.ArrayList;

public class CPP14PreProcessor extends CPP14BaseListener implements PreProcessor {

    private final ArrayList<TerminalNode> nodeList = new ArrayList<>();

    @Override
    public ArrayList<TerminalNode> getNodeList() {
        return this.nodeList;
    }

    @Override
    public void visitTerminal(TerminalNode node) {
        super.visitTerminal(node);

        switch (node.getSymbol().getType()) {

            default:
                if (node.getText().length() > 1) {
                    ((CommonToken) node.getSymbol()).setText(node.getText().toLowerCase());
                }

                if (node.getText().length() > 0) {
                    nodeList.add(node);
                }
        }
    }

}
