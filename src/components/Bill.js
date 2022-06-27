import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Bill({ bill, sessionID }) {
    const url = "http://localhost:3002";
    const handleDeleteBill = async () => {
        axios.delete(`${url}/bill`, { data: { billID: bill.id }, headers: { "Authorization": sessionID } }).then(
            console.log("success")
        )
    }
    const navigate = useNavigate();
    const navigateToEditBill = () => {
        navigate('/editbill', { state: { bills: bill, sessionID: sessionID } })
    }
    return (
        <Card className="bill-card" variant="outlined" sx={{ minWidth: 275 }}>
            <CardContent >
                <Typography className="bill-name" variant="h5" component="div">
                    {bill.name}
                </Typography>
                <Typography className="bill-amount" variant="h3" component="div">
                    {bill.amount}
                </Typography>
                <Typography className="bill-date" variant="h6" component="div" >
                    {bill.due_date}
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={navigateToEditBill} size="small">Edit</Button>
            </CardActions>
            <CardActions>
                <Button size="small" onClick={handleDeleteBill}>Close</Button>
            </CardActions>
        </Card>

    )
}
