// Blockchain Trust System - Smart Contracts für Transparenz und Vertrauen
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SmartContract {
  id: string;
  name: string;
  address: string;
  type: 'project-tracking' | 'warranty' | 'payment-escrow' | 'certification' | 'review-system';
  status: 'active' | 'deployed' | 'testing' | 'inactive';
  deployedAt: Date;
  transactions: number;
  gasFees: string;
  description: string;
}

interface ProjectTracking {
  projectId: string;
  projectName: string;
  customerAddress: string;
  installerAddress: string;
  contractAddress: string;
  status: 'planning' | 'approved' | 'installation' | 'completed' | 'verified' | 'disputed';
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    completed: boolean;
    completedAt?: Date;
    verified: boolean;
    ipfsHash: string;
  }>;
  totalValue: number; // EUR
  currentValue: number; // EUR paid so far
  disputeDeadline: Date;
  createdAt: Date;
  completedAt?: Date;
}

interface WarrantyRecord {
  id: string;
  productId: string;
  customerAddress: string;
  manufacturer: string;
  warrantyPeriod: number; // months
  startDate: Date;
  endDate: Date;
  coverage: Array<{
    type: string;
    description: string;
    coveragePercentage: number;
  }>;
  smartContractAddress: string;
  registeredOn: Date;
  isActive: boolean;
}

interface Review {
  id: string;
  reviewId: string;
  projectId: string;
  customerAddress: string;
  rating: number; // 1-5
  comment: string;
  isVerified: boolean;
  verificationWeight: number;
  ipfsHash: string;
  timestamp: Date;
  smartContractAddress: string;
  tokensAwarded: number;
}

interface TransactionHash {
  hash: string;
  type: 'deployment' | 'milestone' | 'payment' | 'verification' | 'review';
  description: string;
  timestamp: Date;
  blockNumber: number;
  gasUsed: number;
  status: 'pending' | 'confirmed' | 'failed';
  involvedAddresses: string[];
}

const BlockchainTrustSystem: React.FC = () => {
  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);
  const [projectTracking, setProjectTracking] = useState<ProjectTracking[]>([]);
  const [warrantyRecords, setWarrantyRecords] = useState<WarrantyRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [transactions, setTransactions] = useState<TransactionHash[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const web3Ref = useRef<any>(null);

  useEffect(() => {
    initializeBlockchain();
    return () => {
      // Cleanup on unmount
    };
  }, []);

  const initializeBlockchain = async () => {
    setIsLoading(true);

    try {
      // Simulate Web3 connection
      await simulateWeb3Connection();

      // Load existing smart contracts
      await loadSmartContracts();

      // Load blockchain data
      await Promise.all([
        loadProjectTrackingData(),
        loadWarrantyRecords(),
        loadVerifiedReviews(),
        loadTransactionHistory()
      ]);

    } catch (error) {
      console.error('Blockchain initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateWeb3Connection = async () => {
    // Simulate wallet connection (in real app, would connect to MetaMask, WalletConnect, etc.)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsConnected(true);
    setWalletAddress('0x742d35Cc6634C0532925a3b844Bc6e1b8c8e6e9b');
    setNetworkId(1); // Ethereum Mainnet
  };

  const loadSmartContracts = async () => {
    const mockContracts: SmartContract[] = [
      {
        id: 'project-tracker-v1',
        name: 'ZOE Project Tracker',
        address: '0x742d35Cc6634C0532925a3b844Bc6e1b8c8e6e9b',
        type: 'project-tracking',
        status: 'active',
        deployedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        transactions: 247,
        gasFees: '0.0234',
        description: 'Verfolgt Solaranlagen-Projekte von der Planung bis zur Fertigstellung'
      },
      {
        id: 'warranty-nft-v1',
        name: 'ZOE Warranty NFT',
        address: '0x1234567890123456789012345678901234567890',
        type: 'warranty',
        status: 'active',
        deployedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        transactions: 89,
        gasFees: '0.0156',
        description: 'Digitale Garantiezertifikate als NFTs gespeichert'
      },
      {
        id: 'payment-escrow-v1',
        name: 'ZOE Payment Escrow',
        address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        type: 'payment-escrow',
        status: 'active',
        deployedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        transactions: 156,
        gasFees: '0.0321',
        description: 'Sichere Zahlungshinterlegung bis zur Projektverifizierung'
      },
      {
        id: 'review-consensus-v1',
        name: 'ZOE Review Consensus',
        address: '0xfedcbafedcbafedcbafedcbafedcbafedcba',
        type: 'review-system',
        status: 'active',
        deployedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        transactions: 34,
        gasFees: '0.0189',
        description: 'Manipulationssicheres Bewertungssystem mit Konsens'
      }
    ];
    setSmartContracts(mockContracts);
  };

  const loadProjectTrackingData = async () => {
    const mockProjects: ProjectTracking[] = [
      {
        projectId: 'proj-001',
        projectName: 'Solaranlage Familie Schmidt',
        customerAddress: '0x1234567890123456789012345678901234567890',
        installerAddress: '0x742d35Cc6634C0532925a3b844Bc6e1b8c8e6e9b',
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc6e1b8c8e6e9b',
        status: 'completed',
        milestones: [
          {
            id: 'milestone-1',
            name: 'Baustellen-Vorbereitung',
            description: 'Genehmigungen und Baustellen-Vorbereitung',
            completed: true,
            completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
            verified: true,
            ipfsHash: 'QmXyz...'
          },
          {
            id: 'milestone-2',
            name: 'Montage der Solarmodule',
            description: 'Installation aller Solarmodule auf dem Dach',
            completed: true,
            completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            verified: true,
            ipfsHash: 'QmAbc...'
          },
          {
            id: 'milestone-3',
            name: 'Elektrische Installation',
            description: 'Anschluss an das Stromnetz und Inbetriebnahme',
            completed: true,
            completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            verified: true,
            ipfsHash: 'QmDef...'
          }
        ],
        totalValue: 25000,
        currentValue: 25000,
        disputeDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        projectId: 'proj-002',
        projectName: 'Gewerbeanlage SolarTech GmbH',
        customerAddress: '0x2345678901234567890123456789012345678901',
        installerAddress: '0x742d35Cc6634C0532925a3b844Bc6e1b8c8e6e9b',
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc6e1b8c8e6e9b',
        status: 'installation',
        milestones: [
          {
            id: 'milestone-1',
            name: 'Standort-Analyse',
            description: 'Technische und bauliche Analyse des Standorts',
            completed: true,
            completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            verified: true,
            ipfsHash: 'QmGhi...'
          }
        ],
        totalValue: 85000,
        currentValue: 28333, // 1/3 paid after first milestone
        disputeDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      }
    ];
    setProjectTracking(mockProjects);
  };

  const loadWarrantyRecords = async () => {
    const mockWarranties: WarrantyRecord[] = [
      {
        id: 'warranty-001',
        productId: 'panel-qcells-420w-001',
        customerAddress: '0x1234567890123456789012345678901234567890',
        manufacturer: 'Q Cells',
        warrantyPeriod: 300, // 25 years
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        endDate: new Date(Date.now() + 24 * 365 * 24 * 60 * 60 * 1000), // 24 years from now
        coverage: [
          {
            type: 'Leistungsgarantie',
            description: 'Mindestleistung von 85% nach 25 Jahren',
            coveragePercentage: 85
          },
          {
            type: 'Produktionsfehler',
            description: 'Kostenloser Austausch bei Material- und Produktionsfehlern',
            coveragePercentage: 100
          }
        ],
        smartContractAddress: '0x1234567890123456789012345678901234567890',
        registeredOn: new Date(Date.now() - 360 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        id: 'warranty-002',
        productId: 'inverter-fronius-10kw-001',
        customerAddress: '0x2345678901234567890123456789012345678901',
        manufacturer: 'Fronius',
        warrantyPeriod: 120, // 10 years
        startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
        endDate: new Date(Date.now() + 9.5 * 365 * 24 * 60 * 60 * 1000),
        coverage: [
          {
            type: 'Funktionsgarantie',
            description: 'Garantierte Funktion über 10 Jahre',
            coveragePercentage: 100
          }
        ],
        smartContractAddress: '0x1234567890123456789012345678901234567890',
        registeredOn: new Date(Date.now() - 185 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ];
    setWarrantyRecords(mockWarranties);
  };

  const loadVerifiedReviews = async () => {
    const mockReviews: Review[] = [
      {
        id: 'review-001',
        reviewId: '0xabcdef1234567890',
        projectId: 'proj-001',
        customerAddress: '0x1234567890123456789012345678901234567890',
        rating: 5,
        comment: 'Hervorragende Arbeit! Professionelle Montage und alles pünktlich wie vereinbart.',
        isVerified: true,
        verificationWeight: 1.0,
        ipfsHash: 'QmReview123...',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        smartContractAddress: '0xfedcbafedcbafedcbafedcbafedcbafedcba',
        tokensAwarded: 50
      },
      {
        id: 'review-002',
        reviewId: '0x1234567890abcdef',
        projectId: 'proj-001',
        customerAddress: '0x3456789012345678901234567890123456789012',
        rating: 4,
        comment: 'Gute Qualität, aber die Installation hätte etwas schneller gehen können.',
        isVerified: true,
        verificationWeight: 0.8,
        ipfsHash: 'QmReview456...',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        smartContractAddress: '0xfedcbafedcbafedcbafedcbafedcbafedcba',
        tokensAwarded: 40
      }
    ];
    setReviews(mockReviews);
  };

  const loadTransactionHistory = async () => {
    const mockTransactions: TransactionHash[] = [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890',
        type: 'deployment',
        description: 'Project Tracker Smart Contract deployed',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        blockNumber: 18567234,
        gasUsed: 2450000,
        status: 'confirmed',
        involvedAddresses: ['0x742d35Cc6634C0532925a3b844Bc6e1b8c8e6e9b']
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef',
        type: 'milestone',
        description: 'Milestone completed: Baustellen-Vorbereitung',
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        blockNumber: 18571289,
        gasUsed: 156000,
        status: 'confirmed',
        involvedAddresses: [
          '0x742d35Cc6634C0532925a3b844Bc6e1b8c8e6e9b',
          '0x1234567890123456789012345678901234567890'
        ]
      }
    ];
    setTransactions(mockTransactions);
  };

  // Connect Wallet
  const connectWallet = async () => {
    setIsLoading(true);

    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b844Bc6e1b8c8e6e9b');
      setNetworkId(1);

    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setNetworkId(null);
  };

  // Get Contract Status Color
  const getContractStatusColor = (status: SmartContract['status']): string => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'deployed': return 'text-blue-600 bg-blue-50';
      case 'testing': return 'text-yellow-600 bg-yellow-50';
      case 'inactive': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get Project Status Color
  const getProjectStatusColor = (status: ProjectTracking['status']): string => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'verified': return 'text-blue-600 bg-blue-50';
      case 'installation': return 'text-yellow-600 bg-yellow-50';
      case 'disputed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Format Address
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get Network Name
  const getNetworkName = (networkId: number | null): string => {
    switch (networkId) {
      case 1: return 'Ethereum Mainnet';
      case 3: return 'Ropsten Testnet';
      case 137: return 'Polygon Mainnet';
      default: return 'Unknown Network';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔗 Blockchain Trust System
        </h1>
        <p className="text-gray-600">
          Smart Contracts für Transparenz, Vertrauen und automatisierte Verifizierung
        </p>
      </div>

      {/* Wallet Connection */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Verbindung</h2>
            <div className="space-y-1">
              {isConnected ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Adresse:</span>
                    <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                      {formatAddress(walletAddress)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Netzwerk:</span>
                    <span className="text-sm bg-white px-2 py-1 rounded">
                      {getNetworkName(networkId)}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-gray-600">Nicht verbunden</span>
              )}
            </div>
          </div>

          <button
            onClick={isConnected ? disconnectWallet : connectWallet}
            disabled={isLoading}
            className={`px-6 py-3 font-medium rounded-lg transition-colors ${
              isConnected
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400'
            }`}
          >
            {isLoading ? 'Verbindet...' : isConnected ? 'Trennen' : 'Wallet verbinden'}
          </button>
        </div>
      </div>

      {/* Smart Contracts Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📄 Smart Contracts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {smartContracts.map((contract) => (
            <div key={contract.id} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{contract.name}</h3>
                  <p className="text-sm text-gray-600">{contract.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContractStatusColor(contract.status)}`}>
                  {contract.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Adresse:</span>
                  <span className="font-mono">{formatAddress(contract.address)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Typ:</span>
                  <span className="font-medium capitalize">{contract.type.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaktionen:</span>
                  <span className="font-medium">{contract.transactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gas Fees:</span>
                  <span className="font-medium">{contract.gasFees} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployed:</span>
                  <span className="font-medium">{contract.deployedAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Tracking */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏗️ Projekt-Tracking</h2>
        <div className="space-y-4">
          {projectTracking.map((project) => (
            <div key={project.projectId} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{project.projectName}</h3>
                  <p className="text-sm text-gray-600">
                    Kunde: {formatAddress(project.customerAddress)} |
                    Installateur: {formatAddress(project.installerAddress)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Projektdetails</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gesamtwert:</span>
                      <span className="font-medium">€{project.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ausgezahlt:</span>
                      <span className="font-medium">€{project.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fortschritt:</span>
                      <span className="font-medium">
                        {Math.round((project.currentValue / project.totalValue) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Meilensteine</h4>
                  <div className="space-y-2">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-2 text-sm">
                        <div className={`w-4 h-4 rounded-full ${
                          milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <span className={milestone.completed ? 'text-gray-900' : 'text-gray-500'}>
                          {milestone.name}
                        </span>
                        {milestone.verified && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Smart Contract</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adresse:</span>
                      <span className="font-mono text-xs">{formatAddress(project.contractAddress)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Streitfrist:</span>
                      <span className="font-medium">{project.disputeDeadline.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warranty Records */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🛡️ Garantie-Verwaltung</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warrantyRecords.map((warranty) => (
            <div key={warranty.id} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Garantie für {warranty.productId}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  warranty.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {warranty.isActive ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hersteller:</span>
                  <span className="font-medium">{warranty.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Laufzeit:</span>
                  <span className="font-medium">{warranty.warrantyPeriod} Monate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gültig bis:</span>
                  <span className="font-medium">{warranty.endDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Smart Contract:</span>
                  <span className="font-mono text-xs">{formatAddress(warranty.smartContractAddress)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Abdeckung</h4>
                <div className="space-y-1">
                  {warranty.coverage.map((coverage, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{coverage.type}:</span>
                      <span className="font-medium">{coverage.coveragePercentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Reviews */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">⭐ Verifizierte Bewertungen</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatAddress(review.customerAddress)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {review.isVerified && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      ✓ Verifiziert
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {review.timestamp.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Projekt:</span>
                  <span className="font-medium ml-2">{review.projectId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Verifikationsgewicht:</span>
                  <span className="font-medium ml-2">{review.verificationWeight}</span>
                </div>
                <div>
                  <span className="text-gray-600">Token belohnt:</span>
                  <span className="font-medium ml-2">{review.tokensAwarded} ZOE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 Transaktionsverlauf</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beschreibung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Block
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gas Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.hash}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                    {formatAddress(tx.hash)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded font-medium ${
                      tx.type === 'deployment' ? 'bg-blue-100 text-blue-800' :
                      tx.type === 'milestone' ? 'bg-green-100 text-green-800' :
                      tx.type === 'payment' ? 'bg-purple-100 text-purple-800' :
                      tx.type === 'verification' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.blockNumber.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.gasUsed.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded font-medium ${
                      tx.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust Score Summary */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 Vertrauens-Score Zusammenfassung</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-600">Verifizierungsrate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-600">Abgeschlossene Projekte</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">1.2K</div>
            <div className="text-sm text-gray-600">On-Chain Transaktionen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">0</div>
            <div className="text-sm text-gray-600">Disputes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainTrustSystem;