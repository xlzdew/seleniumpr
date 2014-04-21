package org.openqa.selenium.interactions;

import java.awt.AWTException;
import java.awt.Robot;

import com.google.common.collect.ImmutableMap;
import org.openqa.selenium.remote.DriverCommand;
import org.openqa.selenium.remote.ExecuteMethod;

/**
 * An implementation of the keyboard for use with the remote webdriver.
 */
public class SRobot{

protected final ExecuteMethod executor;
	private static Robot robot=null;
	
	public SRobot(ExecuteMethod executor) {
		this.executor = executor;
	}
	
	public void pressKey(int keyToPress) {
	    executor.execute(DriverCommand.ROBOT_KEYPRESS,
	                     ImmutableMap.of("value", keyToPress));
	}
	
	public void releaseKey(int keyToRelease) {
	    executor.execute(DriverCommand.ROBOT_KEYPRESS,
	                     ImmutableMap.of("value", keyToRelease));
		
	}

	public static synchronized Robot getRobot() {
		if (robot == null) {
			try {
				robot = new Robot();
			} catch (AWTException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return robot;
	}

}
