import React from 'react'
import Arrow from './arrow.gif'

class LoadingComponent extends React.Component {
    render() {
        return (
            <div className="mt-2 col-12 d-flex justify-content-center">
                <div>
                    <div className="w-100 p-3 item text-center preloader">
                        <h4>Processing...</h4>
                        <img src={Arrow} alt="" />
                    </div>
                </div>
            </div>
        )
    }
}

export default LoadingComponent