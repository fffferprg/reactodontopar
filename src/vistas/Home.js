import React, { Component } from 'react'
import { Row, Col, Image } from 'react-bootstrap';

export default class Home extends Component {
    render() {
        return (
            <div>
                <Row>
                        <Col>
                        {/* <Navbar.Brand href="#home"><Image src={require('./assets/lolilogo2.png')} fluid /></Navbar.Brand>         */}
                           <Image src={require('../assets/Odontopar.png')} fluid />
                        </Col>
                </Row>
            </div>
        )
    }
}
