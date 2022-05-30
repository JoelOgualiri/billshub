
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

export default function Bill({ bill }) {
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
                <Button size="small">Edit</Button>
            </CardActions>
            <CardActions>
                <Button size="small">Close</Button>
            </CardActions>
        </Card>

    )
}
