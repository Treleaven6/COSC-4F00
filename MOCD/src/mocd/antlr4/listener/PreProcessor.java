package mocd.antlr4.listener;

import org.antlr.v4.runtime.tree.ParseTreeListener;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.util.ArrayList;

public interface PreProcessor extends ParseTreeListener {

    public ArrayList<TerminalNode> getNodeList();

}
