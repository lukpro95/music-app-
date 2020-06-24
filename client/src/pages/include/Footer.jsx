import React, {Component} from 'react';
import '../../styles/footer.css'

class Footer extends Component {
    render() {
        return (
            <div className="line">
                <div className="container-fluid" id="footer">
                    <div className="row align-items-center h-100">
                        <div className=" d-flex justify-content-center mx-auto">
                            <p>Copyright &copy; 2020 MP App</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;