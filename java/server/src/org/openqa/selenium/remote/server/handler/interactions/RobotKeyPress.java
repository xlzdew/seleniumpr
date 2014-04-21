package org.openqa.selenium.remote.server.handler.interactions;

import java.awt.Robot;
import java.util.Map;

import org.openqa.selenium.interactions.SRobot;
import org.openqa.selenium.remote.server.JsonParametersAware;
import org.openqa.selenium.remote.server.Session;
import org.openqa.selenium.remote.server.handler.WebDriverHandler;
import org.openqa.selenium.remote.server.rest.ResultType;

public class RobotKeyPress extends WebDriverHandler implements JsonParametersAware{
	  	private int key;
	  	public RobotKeyPress(Session session) {
	    super(session);
	  }
	  
		@Override
		public void setJsonParameters(Map<String, Object> allParameters)
				throws Exception {
			int rawKey = (Integer)allParameters.get("value");
			key=rawKey;
			System.out.println("key:"+key);
		}
		
	  public ResultType call() throws Exception {
	  Robot robotInstance = SRobot.getRobot();
		callRobotEvent(robotInstance, key);
	    return ResultType.SUCCESS;
	  }

	  @Override
	  public String toString() {
	    return String.format("[srobot: %s]", "nothing");
	  }
	  private void callRobotEvent(Robot robot, int keyToPress){
		  robot.keyPress(keyToPress);
	  }


}
