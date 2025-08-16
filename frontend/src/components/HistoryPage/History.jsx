import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./History.module.css"

const History = (props) => {
  const [mapClientAllHistory, setMapClientAllHistory] = useState([]);
  useEffect(() => {
    if (!props.onCurrentClientId) {
      console.log("Client ID not ready yet, waiting...");
      return;
    }
    const fetchClientHistory = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/history/get-client-history/${props.onCurrentClientId}`
        ); //props.onCurrentClientId
        console.log("History result", result.data);
        setMapClientAllHistory(result.data.result);
      } catch (err) {
        console.log("internal error", err);
      }
    };
    fetchClientHistory();
  }, [props.onCurrentClientId,props.onRefresh]);
  return (
    <div className={styles.tablecontent}>
      {/* <div> HISTORY</div> */}
      <table>
        <tr>
          <th>DB</th>
          <th>Visited</th>
          <th>Date</th>
          <th>Time</th>
          <th>Expected Date</th>
          <th>Call Type</th>
          <th>Follow Up Date</th>
          <th>Follow Up Time</th>
          <th>Primary Number</th>
          <th>remark</th>
          <th>Product </th>
          <th>Quotation Share </th>
          <th>stage</th>
          <th>assignBy</th>
          <th>assignTo</th>
          <th>verifiedBy</th>
          <th>Action</th>
        </tr>
        {mapClientAllHistory.map((history, idx) => (
          <tr key={idx}>
            <td>{history.database_status_db}</td>
            <td>{history.client_visiting_id}</td>
            <td>{history.date_db}</td>
            <td>{new Date(history.updatedAt).toLocaleTimeString()}</td>
            <td>{history.expectedDate_db}</td>
            <td>{history.callType_db}</td>
            <td>{history.followup_db}</td>
            <td>{history.time_db}</td>
            <td>{history.mobile_1_db}</td>
            <td>{history.remarks_db}</td>
            <td>{history.product_db.map((prod)=>prod.label).join(", ")}</td>
            <td>{history.quotationShare_db}</td>
            <td>{history.stage_db.map((stage)=> stage.label).join(", ")}</td>
            <td>{history.assignBy}</td>
            <td>{history.assignTo}</td>
            <td>{history.verifiedBy_db}</td>
            <td>{history.action_db}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default History;
