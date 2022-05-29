import PropTypes from 'prop-types'
export const Button = ({ onClick, text }) => {
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