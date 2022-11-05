import java.util.HashMap;

public class IDandPasswords {
    HashMap<String, String> loginInfo = new HashMap<String, String>();

    IDandPasswords() {
        loginInfo.put("Bob", "bobiscool");
        loginInfo.put("Bob1", "bobiscool1");
        loginInfo.put("Bob2", "bobiscool2");
    }

    protected HashMap<String, String> getLoginInfo() {
        return loginInfo;
    }
}
