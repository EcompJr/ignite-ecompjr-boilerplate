import React, { Component } from "react";
import { NavigationProvider, StackNavigation } from "@expo/ex-navigation";

import Router from "./router";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPage: Router.getRoute("home")
    };
    //Aqui você deve inicializar seus pacotes de métricas ou configurações padrões. Exemplo:
    //Firebase, Code-push, UXCam, globalProps, etc
  }
  render() {
    return (
      <NavigationProvider router={Router}>
        <StackNavigation initialRoute={this.state.initialPage} />
      </NavigationProvider>
    );
  }
}

export default App;