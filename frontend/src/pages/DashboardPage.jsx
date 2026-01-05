import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import serviceTypeService from '../services/serviceTypeService';
import credentialService from '../services/credentialService';

const DashboardPage = () => {
  const { isVaultUnlocked, isVaultInitialized } = useAuth();
  const [stats, setStats] = useState({
    serviceTypes: 0,
    credentials: 0,
    health: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVaultUnlocked) {
      loadStats();
    }
  }, [isVaultUnlocked]);

  const loadStats = async () => {
    try {
      const [health, serviceTypes, credentials] = await Promise.all([
        authService.checkHealth(),
        serviceTypeService.getAll(),
        credentialService.getAll()
      ]);

      setStats({
        health,
        serviceTypes: serviceTypes.length,
        credentials: credentials.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          Loading dashboard data...
        </div>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #1976d2',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: '#1976d2', marginBottom: '10px' }}>Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Overview of your password manager
      </p>
      
      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #1976d2'
        }}>
          <h3 style={{ color: '#1976d2', marginTop: 0 }}>Service Types</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '15px 0', color: '#1976d2' }}>
            {stats.serviceTypes}
          </p>
          <a 
            href="/service-types" 
            style={{ 
              color: '#1976d2', 
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            Manage Categories →
          </a>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #4caf50'
        }}>
          <h3 style={{ color: '#4caf50', marginTop: 0 }}>Credentials</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '15px 0', color: '#4caf50' }}>
            {stats.credentials}
          </p>
          <a 
            href="/credentials" 
            style={{ 
              color: '#4caf50', 
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            Manage Passwords →
          </a>
        </div>
      </div>

      {/* Vault Status */}
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>Vault Status</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: isVaultUnlocked ? '#4caf50' : '#ff9800'
              }}></div>
              <strong>Vault Status:</strong>
            </div>
            <span style={{ 
              color: isVaultUnlocked ? '#4caf50' : '#ff9800',
              fontWeight: 'bold'
            }}>
              {isVaultUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </span>
          </div>

          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: isVaultInitialized ? '#4caf50' : '#f44336'
              }}></div>
              <strong>Vault Initialized:</strong>
            </div>
            <span style={{ 
              color: isVaultInitialized ? '#4caf50' : '#f44336',
              fontWeight: 'bold'
            }}>
              {isVaultInitialized ? 'YES' : 'NO'}
            </span>
          </div>

          {stats.health && (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                marginBottom: '10px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: stats.health.AuthLocked ? '#f44336' : '#4caf50'
                }}></div>
                <strong>Auth Status:</strong>
              </div>
              <span style={{ 
                color: stats.health.AuthLocked ? '#f44336' : '#4caf50',
                fontWeight: 'bold'
              }}>
                {stats.health.AuthLocked ? 'LOCKED' : 'OK'}
              </span>
            </div>
          )}
        </div>

        <button 
          onClick={loadStats}
          style={{ 
            marginTop: '25px',
            padding: '10px 20px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🔄 Refresh Status
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#e3f2fd',
        padding: '25px',
        borderRadius: '10px',
        marginTop: '30px'
      }}>
        <h3 style={{ marginTop: 0, color: '#1976d2' }}>Quick Actions</h3>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '15px',
          marginTop: '20px'
        }}>
          <a 
            href="/service-types" 
            style={{
              padding: '12px 20px',
              background: 'white',
              color: '#1976d2',
              border: '2px solid #1976d2',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Add Service Type
          </a>
          <a 
            href="/credentials" 
            style={{
              padding: '12px 20px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Add Credential
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;