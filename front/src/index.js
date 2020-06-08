import React from 'react';
import { render } from 'react-dom';
import { Layout ,  Row, Col, Breadcrumb , Select,Form, Transfer,Button,Empty,Menu } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import XLSX from 'xlsx';

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};


function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearch(val) {
  console.log('search:', val);
}


class App extends React.Component {
  state = {
    targetKeys: [],
    selectedKeys: [],
    mockData: [],
  };

  onChange = (value) => {
    if(value === "1"){
      console.log(`selected ${value}`);
      var mockData = []
      var i = 0;
      fetch('http://localhost:4000/export')
        .then(res => res.json())
        .then((datas) => {
          datas.map((data) => {
              mockData.push({
              key: i.toString(),
              title: data.COLUMN_NAME,
              description: data.COLUMN_NAME,
            });
            i++;
          })
           this.setState({ mockData: mockData });
        })
        .catch(console.log)
    }
  }


  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });

    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  // handleScroll = (direction, e) => {
  //   console.log('direction:', direction);
  //   console.log('target:', e.target);
  // };

  submitForm = () => {
  var datas = this.state.mockData  // Datas 34
  var targetKeys = this.state.targetKeys  // key of data
  const arrayFiltered = datas.filter((data) => targetKeys.find((value) => data.key === value));
  const arrayTitle  = arrayFiltered.map(value => {
    return {title : value.title}
  })
  var myJSON = JSON.stringify(arrayTitle)
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: myJSON
  };
  console.log(requestOptions.body)
  fetch('http://localhost:4000/export', requestOptions)
      .then(response => response.json())
      .then(datas => {
        const ws = XLSX.utils.json_to_sheet(datas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        /* generate XLSX file and send to client */
        XLSX.writeFile(wb, "01. E-Learning Upload Template.xlsx")
      }).catch(console.log)
  }



render() {
  const { targetKeys, selectedKeys, mockData } = this.state;
  // targetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

  return (
    <Layout>
    <Header>Header</Header>
    <Layout>
      <Sider>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1"> ส่งออกข้อมูล </Menu.Item>
          </Menu>
      </Sider>
      <Content>
        
      <Row>
      <Col span={24}>
      <div className="site-layout-background" style={{ padding: '20px', backgroundColor: '#ffffff', fontSize:'24px'}}>
        ส่งออกข้อมูล
      </div>
        </Col>
      </Row>
      <Row style={{ margin: '24px 24px 24px 24px', backgroundColor: '#ffffff'}}>
          <Col span={24}>
          <Breadcrumb style={{ padding:'24px', backgroundColor: '#ffffff'}}>
            <Breadcrumb.Item>หน้าหลัก</Breadcrumb.Item>
            <Breadcrumb.Item>ผู้ดูแลระบบ</Breadcrumb.Item>
            <Breadcrumb.Item>ส่งออกข้อมูล</Breadcrumb.Item>
          </Breadcrumb>
          </Col>
          <Col span={24}>
          <Form {...layout}  name="form" >
          <Form.Item  name="employeeType" label="ประเภท">
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="การศึกษาพนักงาน"
              optionFilterProp="children"
              onChange={this.onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
            <Option value="1">E-Learning Upload Template (Report)</Option>
          </Select>
          </Form.Item>
          <Form.Item   name="exportField" label="เลือกข้อมูลที่ต้องการ" >
          <Transfer
            dataSource={mockData}
            titles={['ข้อมูลที่มีให้เลือก', 'ข้อมูลที่เลือก']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            onScroll={this.handleScroll}
            render={item => item.title}
            locale={{
              itemUnit: 'ชิ้น',
              itemsUnit: 'ชิ้น',
              notFoundContent: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<p>ไม่มีข้อมูล</p>}></Empty>,
            }}
            listStyle={{
              width: 250,
              height: 250,
            }}
          />
      </Form.Item>
        <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" onClick={this.submitForm}>
            ส่งออก
          </Button>
          <Button type="info"  style={{marginLeft: "10px" }} onClick={()=>{
            this.setState({ targetKeys: [] });
          }}>
            ยกเลิก
          </Button>
        </Form.Item>
          </Form>
          </Col>
      </Row>
      </Content>
    </Layout>
    <Footer>Footer</Footer>
    </Layout>
  );
 }
};

render(<App />, document.getElementById('root'));