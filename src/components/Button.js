import PropTypes from 'prop-types'
export default function Button({ onClick, text }) {
    return (
        <div>
            <button onClick={onClick} className='btn'>{text}</button>
        </div>
    )
}

Button.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
}