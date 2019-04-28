package mocd.antlr4;

import mocd.antlr4.generated.c.CParser;
import org.antlr.v4.gui.TreeViewer;
import org.antlr.v4.runtime.tree.Tree;

import javax.swing.*;
import java.awt.*;
import java.util.Arrays;

public class DisplayTree {

    public DisplayTree(Tree tree) {

        JFrame frame = new JFrame("DisplayTree");
        JComponent panel = Box.createVerticalBox();
        JScrollPane root = new JScrollPane(panel);

        JLabel label = new JLabel("C");
        label.setAlignmentX(Component.CENTER_ALIGNMENT);
        panel.add(label);

        TreeViewer viewer = new TreeViewer(
                Arrays.asList(CParser.ruleNames),
                tree
        );
        panel.add(viewer);

        frame.add(root);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setPreferredSize(new Dimension(1024, 720));
        frame.pack();
        frame.setVisible(true);


    }
}
