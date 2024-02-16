import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(5 * 60 * 1000); // Default: 5 minutes
  const [selectedFile, setSelectedFile] = useState(null);
  
  const fetchData = async (formData = null) => {
    try {
      let response;
      if (formData) {
        response = await axios.post('https://localhost:7236/api/portfolio/portfolio-calculated-data', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setPortfolioData(response.data);
      }else{console.error('Does not work');}
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const formDataR = new FormData();
    formDataR.append('file', selectedFile);
    fetchData(formDataR); // Initial fetch when component mounts

    const intervalId = setInterval(fetchData, refreshInterval, formDataR); // Fetch data every refreshInterval

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [refreshInterval, selectedFile]);

  const handleRefreshIntervalChange = (event) => {
    const newInterval = parseInt(event.target.value, 10);
    setRefreshInterval(newInterval * 1000); // Convert seconds to milliseconds
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await fetchData(formData);
        
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h1>Crypto Portfolio</h1>
      {portfolioData && (
        <div>
          <h2>Portfolio</h2>
          <ul>
            {portfolioData.portfolio.map((item, index) => (
              <li key={index}>
                <strong>{item.coin}:</strong> Amount: {item.amount} Buy Price: ${item.buyPrice} Change Percentage: {item.changePercentage}% Current Value Total: {item.currentValue}
              </li>
            ))}
          </ul>
          <p>Total Portfolio Value: ${portfolioData.currentTotalPortfolioValue}</p>
          <p>Initial Total Portfolio Value: ${portfolioData.initialTotalPortfolioValue}</p>
          <p>Change Percentage Total Portfolio: {portfolioData.changePercentageTotalPortfolio}%</p>
        </div>
      )}
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload File</button>
      </div>
      <div>
        Refresh interval (seconds):
        <input
          type="number"
          min="1"
          value={refreshInterval / 1000} // Convert milliseconds to seconds
          onChange={handleRefreshIntervalChange}
        />
      </div>
    </div>
  );
};

export default App;
