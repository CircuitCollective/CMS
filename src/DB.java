import java.sql.*;

/** The main database class. */
public class DB {
    public static Connection con;

    static {
        try {
            con = DriverManager.getConnection("jdbc:sqlite:main.db");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private DB() {}
}
