package mocd.antlr4;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public enum SupportedGrammar {
    // Supported Grammars
    C("C", "11", ".c", ".h"),
    CPP("C++", "14", ".cpp", ".hxx", ".hpp"),
    JAVA("Java", "8",  ".java");

    // Grammar Data
    String name;
    String version;
    String[] extensions;

    // Constructor
    SupportedGrammar(String name, String version, String ... extensions) {
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

    // Map file extensions to Grammars
    private static final Map<String, SupportedGrammar> fileExtensionMap = new HashMap<>();
    static {
        for (SupportedGrammar g : SupportedGrammar.values()) {
            for (String ext : g.getExtensions()) {
                fileExtensionMap.put(ext, g);
            }
        }
    }

    /**
     * Attempts to match a Grammar using a String representing a file extension. Returns null if no matches were found.
     * @param extension file extension
     * @return Grammar
     */
    public static SupportedGrammar fromFileExtension(String extension) {
        return fileExtensionMap.getOrDefault(extension, null);
    }

    /**
     * Attempts to match a Grammar using a File. Returns null if no matches were found.
     * @param file  File
     * @return Grammar
     */
    public static SupportedGrammar fromFile(File file) {
        String fileName = file.getName();
        String ext = fileName.substring(fileName.lastIndexOf("."));
        return fromFileExtension(ext);
    }

}