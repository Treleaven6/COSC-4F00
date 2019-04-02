package drjava.gui;

import drjava.parser.FileParser;
import drjava.parser.Grammar;
import org.antlr.v4.gui.TreeViewer;
import org.antlr.v4.runtime.tree.Tree;

import javax.swing.*;
import java.awt.*;
import java.util.Arrays;

public class DisplayTree {

    public DisplayTree(String title, Grammar grammar, Tree tree) {

        JFrame frame = new JFrame(title);
        JComponent panel = Box.createVerticalBox();
        JScrollPane root = new JScrollPane(panel);

        JLabel label = new JLabel(grammar.toString());
        label.setAlignmentX(Component.CENTER_ALIGNMENT);
        panel.add(label);

        TreeViewer viewer = new TreeViewer(
                Arrays.asList(FileParser.getRuleNames(grammar)),
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
