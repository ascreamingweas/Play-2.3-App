package controllers;

import play.mvc.Result;

import views.html.index;

public class Application extends play.mvc.Controller {

    public Result index() {
        return ok(index.render("Hello World!"));
    }

}
