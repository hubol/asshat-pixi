import {createApplication} from "../src/asshat/createApplication";

const application = createApplication({width: 640, height: 480, targetFps: 60});
application.canvasElement.id = "gameCanvas";
document.body.appendChild(application.canvasElement);