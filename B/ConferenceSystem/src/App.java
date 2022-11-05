public class App {
    public static void main(String[] args) throws Exception {
        System.out.println("Hello, World!");

        IDandPasswords idandPasswords = new IDandPasswords();

        LoginUI loginUI = new LoginUI(idandPasswords.getLoginInfo());

    }
}
