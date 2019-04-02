package drjava.parser;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public enum Grammar {
    // Supported Grammars
    C("C", "11", ".c", ".h"),
    CPP("C++", "14", ".cpp", ".hxx"),
    JAVA("Java", "8",  ".java");

    // Map file extensions to Grammars
    private static final Map<String, Grammar> fileExtensionMap = new HashMap<>();
    static {
        for (Grammar g : Grammar.values()) {
            for (String ext : g.getExtensions()) {
                fileExtensionMap.put(ext, g);
            }
        }
    }

    // Grammar Data
    String name;
    String version;
    String[] extensions;

    // Constructor
    Grammar(String name, String version, String ... extensions) {
        this.name = name;
        this.version = version;
        this.extensions = extensions;
    }

    // Accessor Methods
    public String getName() {
        return name;
    }

    public String getVersion() {
        return version;
    }

    public String[] getExtensions() {
        return extensions;
    }

    @Override
    public String toString() {
        return String.format("%s %s", name, version);
    }

    /**
     * Attempts to match a Grammar using a String representing a file extension. Returns null if no matches were found.
     * @param extension file extension
     * @return Grammar
     */
    public static Grammar fromFileExtension(String extension) {
        return fileExtensionMap.getOrDefault(extension, null);
    }

    /**
     * Attempts to match a Grammar using a File. Returns null if no matches were found.
     * @param file  File
     * @return Grammar
     */
    public static Grammar fromFile(File file) {
        String fileName = file.getName();
        String ext = fileName.substring(fileName.lastIndexOf("."));
        return fromFileExtension(ext);
    }

}