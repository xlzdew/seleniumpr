require File.expand_path("../../spec_helper", __FILE__)

module Selenium
  module WebDriver
    module Safari
      describe Bridge do
        let(:caps)    { {} }
        let(:server)  { double(Server, receive: response).as_null_object }
        let(:browser) { double(Browser).as_null_object }
        let(:extensions) { double(Extensions).as_null_object }

        let :bridge_options do
          { skip_extension_installation: true }
        end

        let :response do
          {
            'id' => '1',
            'response' => {
              'sessionId' => 'opaque', "value" => @default_capabilities ,
              'status'    => 0
            },
          }
        end

        before do
          @default_capabilities = Remote::Capabilities.safari.as_json

          Remote::Capabilities.stub(:safari).and_return(caps)
          Server.stub(:new).and_return(server)
          Browser.stub(:new).and_return(browser)
          Extensions.stub(:new).and_return(extensions)
        end


        it 'takes desired capabilities' do
          custom_caps = Remote::Capabilities.new
          custom_caps['foo'] = 'bar'

          server.should_receive(:send).with do |payload|
            payload[:command][:parameters][:desiredCapabilities]['foo'].should == 'bar'
          end

          Bridge.new(bridge_options.merge(desired_capabilities: custom_caps))
        end

        it 'lets direct arguments take presedence over capabilities' do
          custom_caps = Remote::Capabilities.new
          custom_caps['cleanSession'] = false

          server.should_receive(:send).with do |payload|
            payload[:command][:parameters][:desiredCapabilities]['safari.options']['cleanSession'].should == true
          end

          Bridge.new(bridge_options.merge(:clean_session => true))
        end

      end
    end
  end
end