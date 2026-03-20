/**
 * KodaPay - Web3 Subscription Protocol on Polkadot
 * Elite SaaS Premium UI with Sidebar Navigation
 */

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { walletConnector, connectWallet, createContract, getWalletBalance, disconnectWallet, isConnected } from '../lib/wallet-connector'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import HeroStats from '../components/HeroStats'
import CreateSubscription from '../components/CreateSubscription'
import QuickTools from '../components/QuickTools'
import PaymentExecutor from '../components/PaymentExecutor'
import SubscriptionsTable from '../components/SubscriptionsTable'
import Footer from '../components/Footer'
import WalletSelector from '../components/WalletSelector'

// Contract ABIs
const KodaPay_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external", 
  "function createSubscription(address receiver, uint256 amount, uint256 frequency) external returns (uint256)",
  "function executePayment(uint256 subId) external",
  "function cancelSubscription(uint256 subId) external",
  "function userBalances(address user) external view returns (uint256)",
  "function isPaymentDue(uint256 subId) external view returns (bool)",
  "function getSubscription(uint256 subId) external view returns (address, address, uint256, uint256, uint256, bool)",
  "function getUserSubscriptions(address user) external view returns (uint256[])"
]

const USDT_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function faucet(address to, uint256 amount) external"
]

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
  },
  mainWrapper: {
    flex: 1,
    marginLeft: '72px',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: '32px',
    maxWidth: '1200px',
    width: '100%',
  },
  welcome: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    textAlign: 'center',
    padding: '48px',
  },
  welcomeLogo: {
    width: '64px',
    height: '64px',
    backgroundColor: '#E6007A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2px',
    marginBottom: '32px',
  },
  welcomeLogoText: {
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '28px',
  },
  welcomeTitle: {
    fontSize: '42px',
    fontWeight: 700,
    color: '#111111',
    letterSpacing: '-1.5px',
    marginBottom: '16px',
  },
  welcomeTitlePink: {
    color: '#E6007A',
  },
  welcomeText: {
    fontSize: '16px',
    color: '#737373',
    maxWidth: '420px',
    marginBottom: '40px',
    lineHeight: 1.7,
  },
  welcomeBtn: {
    padding: '16px 40px',
    backgroundColor: '#111111',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '2px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  welcomeHint: {
    fontSize: '12px',
    color: '#A3A3A3',
    marginTop: '20px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #F4F4F5',
    borderTopColor: '#E6007A',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loaderText: {
    color: '#737373',
    fontSize: '14px',
  },
  depositModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '2px',
    width: '400px',
    maxWidth: '90%',
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E5E5',
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#111111',
  },
  modalBody: {
    padding: '24px',
  },
  modalLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: '#525252',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  modalInput: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#F9F9FB',
    border: '1px solid #E5E5E5',
    borderRadius: '2px',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', monospace",
    color: '#111111',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  modalBtn: {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    borderRadius: '2px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalBtnPrimary: {
    backgroundColor: '#E6007A',
    color: '#FFFFFF',
  },
  modalBtnSecondary: {
    backgroundColor: '#F4F4F5',
    color: '#525252',
  },
}

const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 010-4h14v4"/>
    <path d="M3 5v14a2 2 0 002 2h16v-5"/>
    <path d="M18 12a2 2 0 100 4 2 2 0 000-4z"/>
  </svg>
)

export default function Home() {
  // Mounting state
  const [isMounted, setIsMounted] = useState(false)
  const [walletReady, setWalletReady] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Wallet states
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState('0')
  const [kodaPayContract, setKodaPayContract] = useState(null)
  const [usdtContract, setUsdtContract] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  
  // UI state
  const [usdtBalance, setUsdtBalance] = useState('0')
  const [vaultBalance, setVaultBalance] = useState('0')
  const [subscriptions, setSubscriptions] = useState([])
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [modalAmount, setModalAmount] = useState('')
  
  // Form states
  const [newSubReceiver, setNewSubReceiver] = useState('')
  const [newSubAmount, setNewSubAmount] = useState('')
  const [newSubFrequency, setNewSubFrequency] = useState('')

  // Contract addresses
  const KODAPAY_ADDRESS = process.env.NEXT_PUBLIC_KodaPay_ADDRESS || process.env.NEXT_PUBLIC_SUBSCRIPT_ADDRESS
  const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS
  
  // Testing configuration
  const FAUCET_AMOUNT = '100'

  // Initialize client-side
  useEffect(() => {
    setIsMounted(true)
    
    const initWallet = async () => {
      try {
        if (isConnected()) {
          const info = walletConnector.getConnectionInfo()
          setAccount(info.account)
          setChainId(info.chainId)
          setWalletReady(true)
          await loadWalletData()
        }
        setWalletReady(true)
      } catch (error) {
        console.error('Failed to initialize wallet:', error)
        setWalletReady(true)
      }
    }
    
    initWallet()
  }, [])

  useEffect(() => {
    if (account && isMounted && walletReady) {
      loadBalances()
      loadSubscriptions()
    }
  }, [account, isMounted, walletReady, kodaPayContract, usdtContract])

  const handleConnectWallet = async () => {
    if (!isMounted || !walletReady) return

    setLoading(true)
    
    try {
      const result = await connectWallet('http://127.0.0.1:8545', 31337)

      if (result.success) {
        setAccount(result.account)
        setChainId(result.chainId)
        await loadWalletData()
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      if (error.message.includes('No Ethereum wallet detected')) {
        setShowWalletSelector(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleWalletSelect = async (selectedWallet) => {
    setShowWalletSelector(false)
    walletConnector.selectedProvider = selectedWallet.provider
    walletConnector.providerInfo = selectedWallet
    await handleConnectWallet()
  }

  const loadWalletData = async () => {
    try {
      const walletBalance = await getWalletBalance()
      setBalance(walletBalance)
      
      if (KODAPAY_ADDRESS) {
        const kodaPay = createContract(KODAPAY_ADDRESS, KodaPay_ABI)
        setKodaPayContract(kodaPay)
      }
      
      if (USDT_ADDRESS) {
        const usdt = createContract(USDT_ADDRESS, USDT_ABI)
        setUsdtContract(usdt)
      }
    } catch (error) {
      console.error('Failed to load wallet data:', error)
    }
  }

  const handleDisconnectWallet = () => {
    disconnectWallet()
    setAccount('')
    setChainId(null)
    setBalance('0')
    setKodaPayContract(null)
    setUsdtContract(null)
    setUsdtBalance('0')
    setVaultBalance('0')
    setSubscriptions([])
  }

  const loadBalances = async () => {
    if (!usdtContract || !kodaPayContract || !account) return
    
    try {
      const usdtBal = await usdtContract.balanceOf(account)
      const vaultBal = await kodaPayContract.userBalances(account)
      
      setUsdtBalance(ethers.formatUnits(usdtBal, 6))
      setVaultBalance(ethers.formatUnits(vaultBal, 6))
    } catch (error) {
      console.error('Error loading balances:', error)
    }
  }

  const loadSubscriptions = async () => {
    if (!kodaPayContract || !account) return
    
    try {
      const subIds = await kodaPayContract.getUserSubscriptions(account)
      const subs = []
      
      for (let id of subIds) {
        const sub = await kodaPayContract.getSubscription(id)
        const isDue = await kodaPayContract.isPaymentDue(id)
        
        subs.push({
          id: id.toString(),
          owner: sub[0],
          receiver: sub[1],
          amount: ethers.formatUnits(sub[2], 6),
          frequency: sub[3].toString(),
          lastPayment: sub[4].toString(),
          active: sub[5],
          isDue
        })
      }
      
      setSubscriptions(subs)
    } catch (error) {
      console.error('Error loading subscriptions:', error)
    }
  }

  // Handler functions
  const handleDeposit = async () => {
    if (!kodaPayContract || !usdtContract || !modalAmount) return
    
    setLoading(true)
    try {
      const parsedAmount = ethers.parseUnits(modalAmount, 6)
      
      const currentAllowance = await usdtContract.allowance(account, KODAPAY_ADDRESS)
      
      if (currentAllowance < parsedAmount) {
        const approveTx = await usdtContract.approve(KODAPAY_ADDRESS, parsedAmount)
        await approveTx.wait()
      }
      
      const depositTx = await kodaPayContract.deposit(parsedAmount)
      await depositTx.wait()
      
      await loadBalances()
      setShowDepositModal(false)
      setModalAmount('')
    } catch (error) {
      console.error('Deposit error:', error)
    }
    setLoading(false)
  }

  const handleWithdraw = async () => {
    if (!kodaPayContract || !modalAmount) return
    
    setLoading(true)
    try {
      const parsedAmount = ethers.parseUnits(modalAmount, 6)
      const tx = await kodaPayContract.withdraw(parsedAmount)
      await tx.wait()
      
      await loadBalances()
      setShowWithdrawModal(false)
      setModalAmount('')
    } catch (error) {
      console.error('Withdrawal error:', error)
    }
    setLoading(false)
  }

  const handleCreateSubscription = async () => {
    if (!kodaPayContract || !newSubReceiver || !newSubAmount || !newSubFrequency) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(newSubAmount, 6)
      const frequency = parseInt(newSubFrequency) * 86400
      
      const tx = await kodaPayContract.createSubscription(newSubReceiver, amount, frequency)
      await tx.wait()
      
      setNewSubReceiver('')
      setNewSubAmount('')
      setNewSubFrequency('')
      await loadSubscriptions()
    } catch (error) {
      console.error('Create subscription error:', error)
    }
    setLoading(false)
  }

  const handleCancelSubscription = async (subId) => {
    if (!kodaPayContract) return
    
    setLoading(true)
    try {
      const tx = await kodaPayContract.cancelSubscription(subId)
      await tx.wait()
      await loadSubscriptions()
    } catch (error) {
      console.error('Cancel subscription error:', error)
    }
    setLoading(false)
  }

  const handleExecutePayment = async (subId) => {
    if (!kodaPayContract) return
    
    setLoading(true)
    try {
      const tx = await kodaPayContract.executePayment(subId)
      await tx.wait()
      await loadSubscriptions()
      await loadBalances()
    } catch (error) {
      console.error('Execute payment error:', error)
    }
    setLoading(false)
  }

  const handleRunAllDue = async () => {
    const dueSubs = subscriptions.filter(s => s.active && s.isDue)
    for (const sub of dueSubs) {
      await handleExecutePayment(sub.id)
    }
  }

  const handleFaucet = async () => {
    if (!usdtContract || !account) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(FAUCET_AMOUNT, 6)
      const tx = await usdtContract.faucet(account, amount)
      await tx.wait()
      await loadBalances()
    } catch (error) {
      console.error('Faucet error:', error)
    }
    setLoading(false)
  }

  const handleAddToken = async () => {
    if (!USDT_ADDRESS || !window.ethereum) return
    
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: USDT_ADDRESS,
            symbol: 'mUSDT',
            decimals: 6,
          },
        },
      })
    } catch (error) {
      console.error('Add token error:', error)
    }
  }

  // Computed values
  const dueSubscriptions = subscriptions.filter(s => s.active && s.isDue)
  const totalPending = dueSubscriptions.reduce((acc, s) => acc + parseFloat(s.amount), 0).toFixed(2)
  const activeSubscriptions = subscriptions.filter(s => s.active).length

  // Loading state
  if (!isMounted) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner}></div>
        <p style={styles.loaderText}>Loading KodaPay...</p>
      </div>
    )
  }

  return (
    <div style={styles.layout}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={styles.mainWrapper}>
        <Header
          account={account}
          chainId={chainId}
          loading={loading}
          walletReady={walletReady}
          wndBalance={balance}
          usdtBalance={usdtBalance}
          onConnect={handleConnectWallet}
          onDisconnect={handleDisconnectWallet}
        />

        <main style={styles.main}>
          {!account ? (
            <div style={styles.welcome}>
              <div style={styles.welcomeLogo}>
                <span style={styles.welcomeLogoText}>K</span>
              </div>
              <h1 style={styles.welcomeTitle}>
                Koda<span style={styles.welcomeTitlePink}>Pay</span>
              </h1>
              <p style={styles.welcomeText}>
                The decentralized subscription protocol built for Polkadot. 
                Manage recurring payments on-chain with complete transparency and security.
              </p>
              <button
                onClick={handleConnectWallet}
                disabled={!walletReady || loading}
                style={{
                  ...styles.welcomeBtn,
                  opacity: (!walletReady || loading) ? 0.5 : 1,
                  cursor: (!walletReady || loading) ? 'not-allowed' : 'pointer',
                }}
                onMouseOver={(e) => {
                  if (walletReady && !loading) e.target.style.backgroundColor = '#2a2a2a'
                }}
                onMouseOut={(e) => {
                  if (walletReady && !loading) e.target.style.backgroundColor = '#111111'
                }}
              >
                <WalletIcon />
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
              <p style={styles.welcomeHint}>
                Supports Talisman, SubWallet, MetaMask
              </p>
            </div>
          ) : (
            <>
              {/* Hero Stats */}
              <HeroStats
                vaultBalance={vaultBalance}
                totalSubscriptions={subscriptions.length}
                activeSubscriptions={activeSubscriptions}
                onDeposit={() => setShowDepositModal(true)}
                onWithdraw={() => setShowWithdrawModal(true)}
              />

              {/* Main Actions Grid */}
              <div style={styles.grid2}>
                <CreateSubscription
                  receiver={newSubReceiver}
                  setReceiver={setNewSubReceiver}
                  amount={newSubAmount}
                  setAmount={setNewSubAmount}
                  frequency={newSubFrequency}
                  setFrequency={setNewSubFrequency}
                  onCreateSubscription={handleCreateSubscription}
                  loading={loading}
                />
                <QuickTools
                  onMintFaucet={handleFaucet}
                  onAddToken={handleAddToken}
                  loading={loading}
                  usdtAddress={USDT_ADDRESS}
                />
              </div>

              {/* Payment Executor */}
              <PaymentExecutor
                dueSubscriptions={dueSubscriptions.length}
                totalPending={totalPending}
                onRunSubscriptions={handleRunAllDue}
                loading={loading}
              />

              {/* Subscriptions Table */}
              <SubscriptionsTable
                subscriptions={subscriptions}
                onCancel={handleCancelSubscription}
                onExecute={handleExecutePayment}
                loading={loading}
              />
            </>
          )}
        </main>

        <Footer />
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div style={styles.depositModal} onClick={() => setShowDepositModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Deposit mUSDT</h3>
            </div>
            <div style={styles.modalBody}>
              <label style={styles.modalLabel}>Amount</label>
              <input
                type="number"
                style={styles.modalInput}
                placeholder="0.00"
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
              />
              <div style={styles.modalActions}>
                <button
                  style={{...styles.modalBtn, ...styles.modalBtnSecondary}}
                  onClick={() => { setShowDepositModal(false); setModalAmount(''); }}
                >
                  Cancel
                </button>
                <button
                  style={{...styles.modalBtn, ...styles.modalBtnPrimary}}
                  onClick={handleDeposit}
                  disabled={loading || !modalAmount}
                >
                  {loading ? 'Depositing...' : 'Deposit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div style={styles.depositModal} onClick={() => setShowWithdrawModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Withdraw mUSDT</h3>
            </div>
            <div style={styles.modalBody}>
              <label style={styles.modalLabel}>Amount</label>
              <input
                type="number"
                style={styles.modalInput}
                placeholder="0.00"
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
              />
              <div style={styles.modalActions}>
                <button
                  style={{...styles.modalBtn, ...styles.modalBtnSecondary}}
                  onClick={() => { setShowWithdrawModal(false); setModalAmount(''); }}
                >
                  Cancel
                </button>
                <button
                  style={{...styles.modalBtn, ...styles.modalBtnPrimary}}
                  onClick={handleWithdraw}
                  disabled={loading || !modalAmount}
                >
                  {loading ? 'Withdrawing...' : 'Withdraw'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <WalletSelector
          onWalletSelect={handleWalletSelect}
          onCancel={() => setShowWalletSelector(false)}
        />
      )}
    </div>
  )
}
