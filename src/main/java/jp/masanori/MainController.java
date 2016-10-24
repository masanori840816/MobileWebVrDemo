package jp.masanori;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
    @RequestMapping("/home")
    public String mainpage(Model model){
        return "mainpage";
    }
}