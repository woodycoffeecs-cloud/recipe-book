import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './supabase.js'
import { DEFAULT_RECIPES, CATEGORIES, EDIT_PASSWORD } from './data.js'

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)) }

function LockIcon({ open }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function PasswordModal({ onSuccess, onClose }) {
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100) }, [])
  const submit = () => {
    if (val === EDIT_PASSWORD) { onSuccess() }
    else { setErr(true); setVal(''); setTimeout(() => setErr(false), 1500) }
  }
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,26,24,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, backdropFilter: 'blur(4px)', padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: '#F5F0E8', border: '1px solid #C8C0B0',
        padding: '32px 28px', width: '100%', maxWidth: '340px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }} onClick={e => e.stopPropagation()}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '6px' }}>Chế độ chỉnh sửa</p>
        <p style={{ fontSize: '13px', color: '#8A8A7A', marginBottom: '20px' }}>Nhập mật khẩu để chỉnh sửa công thức</p>
        <input
          ref={inputRef} type="password" value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Mật khẩu..."
          style={{
            width: '100%', padding: '12px 14px',
            border: `1.5px solid ${err ? '#C0392B' : '#C8C0B0'}`,
            background: 'transparent', fontSize: '16px',
            fontFamily: "'DM Sans', sans-serif", outline: 'none',
            marginBottom: err ? '8px' : '20px',
          }}
        />
        {err && <p style={{ fontSize: '12px', color: '#C0392B', marginBottom: '16px' }}>Sai mật khẩu</p>}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', background: 'transparent',
            border: '1px solid #C8C0B0', cursor: 'pointer', fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif",
          }}>Huỷ</button>
          <button onClick={submit} style={{
            flex: 1, padding: '12px', background: '#1A1A18', color: '#F5F0E8',
            border: 'none', cursor: 'pointer', fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif",
          }}>Xác nhận</button>
        </div>
      </div>
    </div>
  )
}

function Editable({ value, onChange, isEditing, tag: Tag = 'span', style = {}, multiline = false }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) ref.current.textContent = value
  }, [value])
  if (!isEditing) return <Tag style={style}>{value}</Tag>
  return (
    <Tag
      ref={ref} contentEditable suppressContentEditableWarning
      onBlur={() => { const v = ref.current?.textContent || ''; if (v !== value) onChange(v) }}
      onKeyDown={e => { if (!multiline && e.key === 'Enter') { e.preventDefault(); ref.current?.blur() } }}
      style={{ ...style, minWidth: '20px', display: multiline ? 'block' : 'inline' }}
    />
  )
}

function RecipeCard({ recipe, isEditing, onUpdate, isMobile }) {
  const cat = CATEGORIES[recipe.category] || CATEGORIES.MATCHA
  const pad = isMobile ? '18px 16px' : '32px'

  const updateIngredient = (si, ii, field, val) => {
    const u = deepClone(recipe); u.sizes[si].ingredients[ii][field] = val; onUpdate(u)
  }
  const updateStep = (si, val) => {
    const u = deepClone(recipe); u.steps[si] = val; onUpdate(u)
  }
  const addIngredient = (si) => {
    const u = deepClone(recipe); u.sizes[si].ingredients.push({ name: 'Nguyên liệu mới', amount: '0ml' }); onUpdate(u)
  }
  const removeIngredient = (si, ii) => {
    const u = deepClone(recipe); u.sizes[si].ingredients.splice(ii, 1); onUpdate(u)
  }
  const addStep = () => {
    const u = deepClone(recipe); u.steps.push('Bước mới...'); onUpdate(u)
  }
  const removeStep = (si) => {
    const u = deepClone(recipe); u.steps.splice(si, 1); onUpdate(u)
  }

  return (
    <div style={{ background: '#fff', borderTop: `3px solid ${cat.color}` }}>
      <div style={{ padding: pad, paddingBottom: '16px', borderBottom: '1px solid #E8E0D0' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', color: cat.color, textTransform: 'uppercase' }}>
          {cat.label}
        </span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? '26px' : '32px',
          fontWeight: 700, lineHeight: 1.15, marginTop: '4px', color: '#1A1A18',
        }}>
          <Editable
            value={recipe.name}
            onChange={v => { const u = deepClone(recipe); u.name = v; onUpdate(u) }}
            isEditing={isEditing}
            style={{ fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
          />
        </h2>
      </div>

      <div style={{ padding: pad, paddingBottom: '16px' }}>
        <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.16em', color: '#8A8A7A', textTransform: 'uppercase', marginBottom: '14px' }}>
          THÀNH PHẦN
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '24px' }}>
          {recipe.sizes.map((size, si) => (
            <div key={si} style={{ background: cat.light, borderRadius: '4px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', color: cat.color }}>
                  <Editable value={size.label} onChange={v => { const u = deepClone(recipe); u.sizes[si].label = v; onUpdate(u) }} isEditing={isEditing} />
                </span>
                <span style={{ fontSize: '10px', color: '#fff', background: cat.color, padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>
                  <Editable value={size.ml} onChange={v => { const u = deepClone(recipe); u.sizes[si].ml = v; onUpdate(u) }} isEditing={isEditing} />
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {size.ingredients.map((ing, ii) => (
                    <tr key={ii} style={{ borderBottom: `1px solid ${cat.color}20` }}>
                      <td style={{ padding: '8px 0', fontSize: isMobile ? '14px' : '13px', color: '#2A2A22', width: '65%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isEditing && (
                            <button onClick={() => removeIngredient(si, ii)} style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: '#C0392B', fontSize: '18px', lineHeight: 1, padding: 0, flexShrink: 0,
                            }}>×</button>
                          )}
                          <Editable value={ing.name} onChange={v => updateIngredient(si, ii, 'name', v)} isEditing={isEditing} />
                        </div>
                      </td>
                      <td style={{ padding: '8px 0', fontSize: isMobile ? '14px' : '13px', fontWeight: 700, color: cat.color, textAlign: 'right' }}>
                        <Editable value={ing.amount} onChange={v => updateIngredient(si, ii, 'amount', v)} isEditing={isEditing} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditing && (
                <button onClick={() => addIngredient(si)} style={{
                  marginTop: '10px', background: 'none', border: `1.5px dashed ${cat.accent}`,
                  color: cat.color, cursor: 'pointer', fontSize: '12px',
                  padding: '6px 12px', fontFamily: "'DM Sans', sans-serif", width: '100%',
                }}>+ Thêm nguyên liệu</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: pad, paddingTop: 0, borderTop: '1px solid #E8E0D0' }}>
        <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.16em', color: '#8A8A7A', textTransform: 'uppercase', margin: '20px 0 14px' }}>
          CÁCH LÀM
        </p>
        <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recipe.steps.map((step, si) => (
            <li key={si} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{
                minWidth: '24px', height: '24px', borderRadius: '50%',
                background: cat.color, color: '#fff', fontSize: '12px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{si + 1}</span>
              <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Editable
                  value={step} onChange={v => updateStep(si, v)} isEditing={isEditing}
                  tag="p" multiline
                  style={{ fontSize: isMobile ? '14px' : '13px', lineHeight: 1.65, color: '#2A2A22', flex: 1 }}
                />
                {isEditing && (
                  <button onClick={() => removeStep(si)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#C0392B', fontSize: '18px', opacity: 0.7, flexShrink: 0,
                  }}>×</button>
                )}
              </div>
            </li>
          ))}
        </ol>
        {isEditing && (
          <button onClick={addStep} style={{
            marginTop: '14px', background: 'none', border: `1.5px dashed ${cat.accent}`,
            color: cat.color, cursor: 'pointer', fontSize: '12px',
            padding: '8px 16px', fontFamily: "'DM Sans', sans-serif",
          }}>+ Thêm bước</button>
        )}
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <span style={{ fontSize: '9px', color: '#C8C0B0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>RECIPE BOOK</span>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: cat.dot || cat.color, marginLeft: '8px', verticalAlign: 'middle' }} />
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ recipes, selected, onSelect, isEditing, onAddRecipe, onClose, isMobile }) {
  const grouped = Object.keys(CATEGORIES).map(cat => ({
    cat, recipes: recipes.filter(r => r.category === cat),
  })).filter(g => g.recipes.length > 0)

  return (
    <>
      <div style={{
        padding: isMobile ? '20px 20px 16px' : '28px 20px 20px',
        borderBottom: '1px solid #C8C0B0',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: '9px', letterSpacing: '0.18em', color: '#8A8A7A', textTransform: 'uppercase', marginBottom: '4px' }}>HƯỚNG DẪN PHA CHẾ</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>Recipe Book</h1>
          <p style={{ fontSize: '10px', color: '#8A8A7A', marginTop: '4px' }}>{recipes.length} công thức · Size M & L</p>
        </div>
        {isMobile && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A4A42', padding: '4px' }}>
            <CloseIcon />
          </button>
        )}
      </div>
      <div style={{ padding: '10px 0', overflowY: 'auto', flex: 1 }}>
        {grouped.map(({ cat, recipes: catRecipes }) => {
          const c = CATEGORIES[cat]
          return (
            <div key={cat}>
              <div style={{ padding: '10px 20px 6px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: c.color, textTransform: 'uppercase' }}>
                {c.label}
              </div>
              {catRecipes.map(r => (
                <button key={r.id} onClick={() => { onSelect(r.id); onClose?.() }} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: isMobile ? '12px 20px 12px 28px' : '9px 20px 9px 28px',
                  background: selected === r.id ? '#FFFFFF' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  fontSize: isMobile ? '15px' : '13px',
                  color: selected === r.id ? '#1A1A18' : '#4A4A42',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: selected === r.id ? 600 : 400,
                  borderLeft: selected === r.id ? `3px solid ${c.color}` : '3px solid transparent',
                  transition: 'all 120ms',
                }}>{r.name}</button>
              ))}
            </div>
          )
        })}
        {isEditing && (
          <button onClick={onAddRecipe} style={{
            display: 'block', width: 'calc(100% - 24px)', margin: '14px auto',
            padding: '10px', background: 'transparent',
            border: '1.5px dashed #8A8A7A', cursor: 'pointer',
            fontSize: '13px', color: '#4A4A42', fontFamily: "'DM Sans', sans-serif",
          }}>+ Thêm món mới</button>
        )}
      </div>
    </>
  )
}

function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: '#1A1A18', color: '#F5F0E8', padding: '10px 20px', fontSize: '13px',
      fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 1500, whiteSpace: 'nowrap', animation: 'fadeUp 200ms ease',
    }}>{msg}</div>
  )
}

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [selected, setSelected] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPwModal, setShowPwModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const saveTimeout = useRef(null)
  const channelRef = useRef(null)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const showToast = (msg, dur = 2200) => { setToast(msg); setTimeout(() => setToast(''), dur) }

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from('recipes').select('*').order('sort_order', { ascending: true })
        if (error) throw error
        if (data && data.length > 0) {
          const parsed = data.map(row => ({ ...row.data, _rowId: row.id }))
          setRecipes(parsed); setSelected(parsed[0]?.id)
        } else { await seedDefaultData() }
      } catch {
        setRecipes(DEFAULT_RECIPES); setSelected(DEFAULT_RECIPES[0]?.id)
        showToast('⚠️ Đang dùng dữ liệu cục bộ (chưa cấu hình Supabase)')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const seedDefaultData = async () => {
    try {
      const rows = DEFAULT_RECIPES.map((r, i) => ({ recipe_id: r.id, sort_order: i, data: r }))
      const { error } = await supabase.from('recipes').insert(rows)
      if (error) throw error
      setRecipes(DEFAULT_RECIPES); setSelected(DEFAULT_RECIPES[0]?.id)
    } catch { setRecipes(DEFAULT_RECIPES); setSelected(DEFAULT_RECIPES[0]?.id) }
  }

  useEffect(() => {
    channelRef.current = supabase
      .channel('recipes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, payload => {
        if (payload.eventType === 'UPDATE')
          setRecipes(prev => prev.map(r => r.id === payload.new.data.id ? { ...payload.new.data, _rowId: payload.new.id } : r))
        else if (payload.eventType === 'INSERT')
          setRecipes(prev => [...prev, { ...payload.new.data, _rowId: payload.new.id }])
        else if (payload.eventType === 'DELETE')
          setRecipes(prev => prev.filter(r => r._rowId !== payload.old.id))
      })
      .subscribe()
    return () => channelRef.current?.unsubscribe()
  }, [])

  const saveRecipe = useCallback(async (updated) => {
    setRecipes(prev => prev.map(r => r.id === updated.id ? updated : r))
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      setSaving(true)
      try {
        const { error } = await supabase.from('recipes').update({ data: updated }).eq('recipe_id', updated.id)
        if (error) throw error
        showToast('✓ Đã lưu')
      } catch { showToast('⚠️ Lỗi lưu dữ liệu') }
      finally { setSaving(false) }
    }, 800)
  }, [])

  const addRecipe = async () => {
    const id = `new-recipe-${Date.now()}`
    const newR = {
      id, name: 'Món mới', category: 'MATCHA',
      sizes: [
        { label: 'SIZE M', ml: '500ml', ingredients: [{ name: 'Nguyên liệu', amount: '0ml' }] },
        { label: 'SIZE L', ml: '700ml', ingredients: [{ name: 'Nguyên liệu', amount: '0ml' }] },
      ],
      steps: ['Bước 1...'],
    }
    try { await supabase.from('recipes').insert({ recipe_id: id, sort_order: recipes.length, data: newR }) } catch {}
    setRecipes(prev => [...prev, newR]); setSelected(id)
  }

  const currentRecipe = recipes.find(r => r.id === selected)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F0E8', fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#8A8A7A' }}>
      Đang tải công thức...
    </div>
  )

  if (isMobile) return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: '#EDEAE0', borderBottom: '1px solid #C8C0B0',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button onClick={() => setShowMenu(true)} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#1A1A18',
          display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 700,
          maxWidth: '60%', overflow: 'hidden',
        }}>
          <MenuIcon />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentRecipe?.name || 'Recipe Book'}
          </span>
        </button>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saving && <span style={{ fontSize: '11px', color: '#8A8A7A' }}>Lưu...</span>}
          <button onClick={() => isEditing ? setIsEditing(false) : setShowPwModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px',
            background: isEditing ? '#1A1A18' : 'transparent',
            color: isEditing ? '#F5F0E8' : '#4A4A42',
            border: `1px solid ${isEditing ? '#1A1A18' : '#C8C0B0'}`,
            cursor: 'pointer', fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
          }}>
            <LockIcon open={isEditing} />
            {isEditing ? 'Khoá' : 'Sửa'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
        {currentRecipe
          ? <RecipeCard recipe={currentRecipe} isEditing={isEditing} onUpdate={saveRecipe} isMobile />
          : <div style={{ padding: '60px 20px', textAlign: 'center', color: '#8A8A7A', fontSize: '15px' }}>
              Nhấn ☰ để chọn công thức
            </div>
        }
      </div>

      {showMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex' }} onClick={() => setShowMenu(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
          <div style={{
            position: 'relative', width: '82%', maxWidth: '300px',
            background: '#EDEAE0', height: '100%',
            display: 'flex', flexDirection: 'column',
            boxShadow: '4px 0 30px rgba(0,0,0,0.2)',
            animation: 'slideIn 200ms ease',
          }} onClick={e => e.stopPropagation()}>
            <SidebarContent
              recipes={recipes} selected={selected} onSelect={setSelected}
              isEditing={isEditing} onAddRecipe={addRecipe}
              onClose={() => setShowMenu(false)} isMobile
            />
          </div>
        </div>
      )}

      {showPwModal && <PasswordModal onSuccess={() => { setIsEditing(true); setShowPwModal(false); showToast('✓ Đã mở chế độ chỉnh sửa') }} onClose={() => setShowPwModal(false)} />}
      <Toast msg={toast} />
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translate(-50%,8px)} to{opacity:1;transform:translate(-50%,0)} }
        @keyframes slideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        button:active { opacity:0.7; }
      `}</style>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: '240px', flexShrink: 0, background: '#EDEAE0',
        borderRight: '1px solid #C8C0B0', height: '100vh', overflowY: 'auto',
        position: 'sticky', top: 0, display: 'flex', flexDirection: 'column',
      }}>
        <SidebarContent recipes={recipes} selected={selected} onSelect={setSelected} isEditing={isEditing} onAddRecipe={addRecipe} isMobile={false} />
      </nav>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '12px 32px', borderBottom: '1px solid #E8E0D0',
          background: '#F5F0E8', gap: '12px', position: 'sticky', top: 0, zIndex: 10,
        }}>
          {saving && <span style={{ fontSize: '11px', color: '#8A8A7A' }}>Đang lưu...</span>}
          {isEditing && (
            <span style={{ fontSize: '11px', color: '#2D6A4F', background: '#D8F3DC', padding: '3px 10px', letterSpacing: '0.05em' }}>
              CHẾ ĐỘ CHỈNH SỬA
            </span>
          )}
          <button onClick={() => isEditing ? setIsEditing(false) : setShowPwModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
            background: isEditing ? '#1A1A18' : 'transparent',
            color: isEditing ? '#F5F0E8' : '#4A4A42',
            border: `1px solid ${isEditing ? '#1A1A18' : '#C8C0B0'}`,
            cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif",
          }}>
            <LockIcon open={isEditing} />
            {isEditing ? 'Khoá lại' : 'Chỉnh sửa'}
          </button>
        </div>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 32px' }}>
          {currentRecipe
            ? <RecipeCard key={currentRecipe.id} recipe={currentRecipe} isEditing={isEditing} onUpdate={saveRecipe} isMobile={false} />
            : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#8A8A7A', fontSize: '14px' }}>
                Chọn công thức từ danh sách bên trái
              </div>
          }
        </div>
      </div>

      {showPwModal && <PasswordModal onSuccess={() => { setIsEditing(true); setShowPwModal(false); showToast('✓ Đã mở chế độ chỉnh sửa') }} onClose={() => setShowPwModal(false)} />}
      <Toast msg={toast} />
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translate(-50%,8px)} to{opacity:1;transform:translate(-50%,0)} }
        button { transition:opacity 150ms; }
        button:hover { opacity:0.8; }
      `}</style>
    </div>
  )
}
